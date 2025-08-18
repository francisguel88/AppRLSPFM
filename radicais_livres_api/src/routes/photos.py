from flask import Blueprint, request, jsonify, session, send_from_directory
from werkzeug.utils import secure_filename
from src.models.models import db, Photo, User, Cell
import os
import uuid
from datetime import datetime

photos_bp = Blueprint('photos', __name__)

# Configurações de upload
UPLOAD_FOLDER = 'uploads/photos'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def check_auth():
    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.get(user_id)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def ensure_upload_folder():
    upload_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', UPLOAD_FOLDER)
    os.makedirs(upload_path, exist_ok=True)
    return upload_path

@photos_bp.route('/', methods=['GET'])
def get_photos():
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        cell_id = request.args.get('cell_id')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = Photo.query
        
        if cell_id:
            query = query.filter_by(cell_id=cell_id)
        
        if start_date:
            query = query.filter(Photo.event_date >= datetime.strptime(start_date, '%Y-%m-%d').date())
        
        if end_date:
            query = query.filter(Photo.event_date <= datetime.strptime(end_date, '%Y-%m-%d').date())
        
        # Filtrar por permissões
        if current_user.role == 'pastor':
            # Pastor vê todas as fotos
            pass
        elif current_user.role == 'discipulador':
            # Discipulador vê fotos das células das suas redes
            network_ids = [network.id for network in current_user.supervised_networks]
            cell_ids = [cell.id for cell in Cell.query.filter(Cell.network_id.in_(network_ids)).all()]
            query = query.filter((Photo.cell_id.in_(cell_ids)) | (Photo.cell_id.is_(None)))
        else:
            # Líder vê fotos das suas células e fotos gerais
            cell_ids = [cell.id for cell in current_user.led_cells]
            query = query.filter((Photo.cell_id.in_(cell_ids)) | (Photo.cell_id.is_(None)))
        
        photos = query.order_by(Photo.created_at.desc()).all()
        
        return jsonify({
            'photos': [photo.to_dict() for photo in photos]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@photos_bp.route('/upload', methods=['POST'])
def upload_photo():
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Tipo de arquivo não permitido'}), 400
        
        # Dados adicionais
        description = request.form.get('description', '')
        event_date = request.form.get('event_date')
        cell_id = request.form.get('cell_id')
        
        # Verificar permissões para a célula
        if cell_id:
            cell = Cell.query.get(cell_id)
            if not cell or not cell.is_active:
                return jsonify({'error': 'Célula não encontrada'}), 404
            
            can_upload = False
            if current_user.role == 'pastor':
                can_upload = True
            elif current_user.role == 'discipulador' and cell.network.supervisor_id == current_user.id:
                can_upload = True
            elif current_user.role == 'lider' and cell.leader_id == current_user.id:
                can_upload = True
            
            if not can_upload:
                return jsonify({'error': 'Sem permissão para enviar fotos para esta célula'}), 403
        
        # Processar data do evento
        event_date_obj = None
        if event_date:
            try:
                event_date_obj = datetime.strptime(event_date, '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        # Salvar arquivo
        upload_path = ensure_upload_folder()
        original_filename = secure_filename(file.filename)
        file_extension = original_filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        
        file_path = os.path.join(upload_path, unique_filename)
        file.save(file_path)
        
        # Salvar no banco de dados
        new_photo = Photo(
            filename=unique_filename,
            original_filename=original_filename,
            description=description,
            uploaded_by=current_user.id,
            event_date=event_date_obj,
            cell_id=int(cell_id) if cell_id else None
        )
        
        db.session.add(new_photo)
        db.session.commit()
        
        return jsonify({
            'message': 'Foto enviada com sucesso',
            'photo': new_photo.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@photos_bp.route('/<int:photo_id>', methods=['PUT'])
def update_photo(photo_id):
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        photo = Photo.query.get_or_404(photo_id)
        
        # Verificar permissões
        can_edit = False
        if current_user.role == 'pastor':
            can_edit = True
        elif photo.uploaded_by == current_user.id:
            can_edit = True
        elif photo.cell and current_user.role == 'discipulador' and photo.cell.network.supervisor_id == current_user.id:
            can_edit = True
        
        if not can_edit:
            return jsonify({'error': 'Sem permissão para editar esta foto'}), 403
        
        data = request.get_json()
        
        if 'description' in data:
            photo.description = data['description']
        
        if 'event_date' in data:
            if data['event_date']:
                try:
                    photo.event_date = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
                except ValueError:
                    return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
            else:
                photo.event_date = None
        
        if 'cell_id' in data and current_user.role in ['discipulador', 'pastor']:
            if data['cell_id']:
                cell = Cell.query.get(data['cell_id'])
                if cell and cell.is_active:
                    can_move = False
                    if current_user.role == 'pastor':
                        can_move = True
                    elif current_user.role == 'discipulador' and cell.network.supervisor_id == current_user.id:
                        can_move = True
                    
                    if can_move:
                        photo.cell_id = data['cell_id']
            else:
                photo.cell_id = None
        
        db.session.commit()
        
        return jsonify({
            'message': 'Foto atualizada com sucesso',
            'photo': photo.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@photos_bp.route('/<int:photo_id>', methods=['DELETE'])
def delete_photo(photo_id):
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        photo = Photo.query.get_or_404(photo_id)
        
        # Verificar permissões
        can_delete = False
        if current_user.role == 'pastor':
            can_delete = True
        elif photo.uploaded_by == current_user.id:
            can_delete = True
        elif photo.cell and current_user.role == 'discipulador' and photo.cell.network.supervisor_id == current_user.id:
            can_delete = True
        
        if not can_delete:
            return jsonify({'error': 'Sem permissão para excluir esta foto'}), 403
        
        # Remover arquivo físico
        upload_path = ensure_upload_folder()
        file_path = os.path.join(upload_path, photo.filename)
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Remover do banco de dados
        db.session.delete(photo)
        db.session.commit()
        
        return jsonify({'message': 'Foto excluída com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@photos_bp.route('/file/<filename>')
def get_photo_file(filename):
    """Servir arquivos de foto"""
    try:
        upload_path = ensure_upload_folder()
        return send_from_directory(upload_path, filename)
    except Exception as e:
        return jsonify({'error': 'Arquivo não encontrado'}), 404

