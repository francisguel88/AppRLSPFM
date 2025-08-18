from flask import Blueprint, request, jsonify, session
from src.models.models import db, Cell, Network, User

cells_bp = Blueprint('cells', __name__)

def check_auth():
    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.get(user_id)

@cells_bp.route('/', methods=['GET'])
def get_cells():
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        if current_user.role == 'pastor':
            # Pastor vê todas as células
            cells = Cell.query.filter_by(is_active=True).all()
        elif current_user.role == 'discipulador':
            # Discipulador vê células das suas redes
            network_ids = [network.id for network in current_user.supervised_networks]
            cells = Cell.query.filter(Cell.network_id.in_(network_ids), Cell.is_active == True).all()
        else:
            # Líder vê apenas suas células
            cells = Cell.query.filter_by(leader_id=current_user.id, is_active=True).all()
        
        return jsonify({
            'cells': [cell.to_dict() for cell in cells]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cells_bp.route('/', methods=['POST'])
def create_cell():
    try:
        current_user = check_auth()
        if not current_user or current_user.role not in ['discipulador', 'pastor']:
            return jsonify({'error': 'Apenas discipuladores e pastores podem criar células'}), 403
        
        data = request.get_json()
        name = data.get('name')
        leader_id = data.get('leader_id')
        network_id = data.get('network_id')
        meeting_day = data.get('meeting_day', '')
        meeting_time = data.get('meeting_time', '')
        location = data.get('location', '')
        
        if not all([name, leader_id, network_id]):
            return jsonify({'error': 'Nome, líder e rede são obrigatórios'}), 400
        
        # Verificar se o líder existe
        leader = User.query.get(leader_id)
        if not leader or leader.role not in ['lider', 'discipulador']:
            return jsonify({'error': 'Líder deve ser um usuário com perfil líder ou discipulador'}), 400
        
        # Verificar se a rede existe
        network = Network.query.get(network_id)
        if not network or not network.is_active:
            return jsonify({'error': 'Rede não encontrada'}), 404
        
        # Verificar permissões para a rede
        if current_user.role == 'discipulador' and network.supervisor_id != current_user.id:
            return jsonify({'error': 'Sem permissão para criar células nesta rede'}), 403
        
        new_cell = Cell(
            name=name,
            leader_id=leader_id,
            network_id=network_id,
            meeting_day=meeting_day,
            meeting_time=meeting_time,
            location=location
        )
        
        db.session.add(new_cell)
        db.session.commit()
        
        return jsonify({
            'message': 'Célula criada com sucesso',
            'cell': new_cell.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cells_bp.route('/<int:cell_id>', methods=['PUT'])
def update_cell(cell_id):
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        cell = Cell.query.get_or_404(cell_id)
        
        # Verificar permissões
        can_edit = False
        if current_user.role == 'pastor':
            can_edit = True
        elif current_user.role == 'discipulador' and cell.network.supervisor_id == current_user.id:
            can_edit = True
        elif current_user.role == 'lider' and cell.leader_id == current_user.id:
            can_edit = True
        
        if not can_edit:
            return jsonify({'error': 'Sem permissão para editar esta célula'}), 403
        
        data = request.get_json()
        
        if 'name' in data:
            cell.name = data['name']
        if 'meeting_day' in data:
            cell.meeting_day = data['meeting_day']
        if 'meeting_time' in data:
            cell.meeting_time = data['meeting_time']
        if 'location' in data:
            cell.location = data['location']
        
        # Apenas discipuladores e pastores podem alterar líder e rede
        if current_user.role in ['discipulador', 'pastor']:
            if 'leader_id' in data:
                leader = User.query.get(data['leader_id'])
                if leader and leader.role in ['lider', 'discipulador']:
                    cell.leader_id = data['leader_id']
            
            if 'network_id' in data and current_user.role == 'pastor':
                network = Network.query.get(data['network_id'])
                if network and network.is_active:
                    cell.network_id = data['network_id']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Célula atualizada com sucesso',
            'cell': cell.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@cells_bp.route('/<int:cell_id>', methods=['DELETE'])
def delete_cell(cell_id):
    try:
        current_user = check_auth()
        if not current_user or current_user.role not in ['discipulador', 'pastor']:
            return jsonify({'error': 'Apenas discipuladores e pastores podem excluir células'}), 403
        
        cell = Cell.query.get_or_404(cell_id)
        
        # Verificar permissões
        if current_user.role == 'discipulador' and cell.network.supervisor_id != current_user.id:
            return jsonify({'error': 'Sem permissão para excluir esta célula'}), 403
        
        cell.is_active = False
        
        db.session.commit()
        
        return jsonify({'message': 'Célula desativada com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

