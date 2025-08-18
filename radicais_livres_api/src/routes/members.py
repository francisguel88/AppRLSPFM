from flask import Blueprint, request, jsonify, session
from src.models.models import db, Member, Cell, User

members_bp = Blueprint('members', __name__)

def check_auth():
    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.get(user_id)

@members_bp.route('/', methods=['GET'])
def get_members():
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        cell_id = request.args.get('cell_id')
        member_type = request.args.get('type')  # membro, fa, visitante
        
        query = Member.query.filter_by(is_active=True)
        
        if cell_id:
            query = query.filter_by(cell_id=cell_id)
        
        if member_type:
            query = query.filter_by(member_type=member_type)
        
        # Filtrar por permissões
        if current_user.role == 'pastor':
            # Pastor vê todos os membros
            pass
        elif current_user.role == 'discipulador':
            # Discipulador vê membros das células das suas redes
            network_ids = [network.id for network in current_user.supervised_networks]
            cell_ids = [cell.id for cell in Cell.query.filter(Cell.network_id.in_(network_ids)).all()]
            query = query.filter(Member.cell_id.in_(cell_ids))
        else:
            # Líder vê apenas membros das suas células
            cell_ids = [cell.id for cell in current_user.led_cells]
            query = query.filter(Member.cell_id.in_(cell_ids))
        
        members = query.all()
        
        return jsonify({
            'members': [member.to_dict() for member in members]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@members_bp.route('/', methods=['POST'])
def create_member():
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        data = request.get_json()
        full_name = data.get('full_name')
        phone = data.get('phone', '')
        email = data.get('email', '')
        member_type = data.get('member_type', 'membro')
        cell_id = data.get('cell_id')
        
        if not full_name:
            return jsonify({'error': 'Nome completo é obrigatório'}), 400
        
        if member_type not in ['membro', 'fa', 'visitante']:
            return jsonify({'error': 'Tipo de membro inválido'}), 400
        
        # Verificar permissões para a célula
        if cell_id:
            cell = Cell.query.get(cell_id)
            if not cell or not cell.is_active:
                return jsonify({'error': 'Célula não encontrada'}), 404
            
            can_add = False
            if current_user.role == 'pastor':
                can_add = True
            elif current_user.role == 'discipulador' and cell.network.supervisor_id == current_user.id:
                can_add = True
            elif current_user.role == 'lider' and cell.leader_id == current_user.id:
                can_add = True
            
            if not can_add:
                return jsonify({'error': 'Sem permissão para adicionar membros nesta célula'}), 403
        
        new_member = Member(
            full_name=full_name,
            phone=phone,
            email=email,
            member_type=member_type,
            cell_id=cell_id
        )
        
        db.session.add(new_member)
        db.session.commit()
        
        return jsonify({
            'message': 'Membro cadastrado com sucesso',
            'member': new_member.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@members_bp.route('/<int:member_id>', methods=['PUT'])
def update_member(member_id):
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        member = Member.query.get_or_404(member_id)
        
        # Verificar permissões
        can_edit = False
        if current_user.role == 'pastor':
            can_edit = True
        elif member.cell:
            if current_user.role == 'discipulador' and member.cell.network.supervisor_id == current_user.id:
                can_edit = True
            elif current_user.role == 'lider' and member.cell.leader_id == current_user.id:
                can_edit = True
        
        if not can_edit:
            return jsonify({'error': 'Sem permissão para editar este membro'}), 403
        
        data = request.get_json()
        
        if 'full_name' in data:
            member.full_name = data['full_name']
        if 'phone' in data:
            member.phone = data['phone']
        if 'email' in data:
            member.email = data['email']
        if 'member_type' in data and data['member_type'] in ['membro', 'fa', 'visitante']:
            member.member_type = data['member_type']
        if 'cell_id' in data:
            # Verificar permissões para a nova célula
            if data['cell_id']:
                new_cell = Cell.query.get(data['cell_id'])
                if new_cell and new_cell.is_active:
                    can_move = False
                    if current_user.role == 'pastor':
                        can_move = True
                    elif current_user.role == 'discipulador' and new_cell.network.supervisor_id == current_user.id:
                        can_move = True
                    
                    if can_move:
                        member.cell_id = data['cell_id']
            else:
                member.cell_id = None
        
        db.session.commit()
        
        return jsonify({
            'message': 'Membro atualizado com sucesso',
            'member': member.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@members_bp.route('/<int:member_id>', methods=['DELETE'])
def delete_member(member_id):
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        member = Member.query.get_or_404(member_id)
        
        # Verificar permissões
        can_delete = False
        if current_user.role == 'pastor':
            can_delete = True
        elif member.cell:
            if current_user.role == 'discipulador' and member.cell.network.supervisor_id == current_user.id:
                can_delete = True
            elif current_user.role == 'lider' and member.cell.leader_id == current_user.id:
                can_delete = True
        
        if not can_delete:
            return jsonify({'error': 'Sem permissão para excluir este membro'}), 403
        
        member.is_active = False
        
        db.session.commit()
        
        return jsonify({'message': 'Membro desativado com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

