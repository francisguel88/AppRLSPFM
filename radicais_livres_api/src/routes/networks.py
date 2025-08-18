from flask import Blueprint, request, jsonify, session
from src.models.models import db, Network, User

networks_bp = Blueprint('networks', __name__)

def check_auth():
    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.get(user_id)

@networks_bp.route('/', methods=['GET'])
def get_networks():
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        if current_user.role == 'pastor':
            # Pastor vê todas as redes
            networks = Network.query.filter_by(is_active=True).all()
        elif current_user.role == 'discipulador':
            # Discipulador vê apenas suas redes
            networks = Network.query.filter_by(supervisor_id=current_user.id, is_active=True).all()
        else:
            # Líder vê apenas a rede da sua célula
            networks = []
            for cell in current_user.led_cells:
                if cell.network and cell.network not in networks:
                    networks.append(cell.network)
        
        return jsonify({
            'networks': [network.to_dict() for network in networks]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@networks_bp.route('/', methods=['POST'])
def create_network():
    try:
        current_user = check_auth()
        if not current_user or current_user.role != 'pastor':
            return jsonify({'error': 'Apenas pastores podem criar redes'}), 403
        
        data = request.get_json()
        name = data.get('name')
        description = data.get('description', '')
        supervisor_id = data.get('supervisor_id')
        
        if not name or not supervisor_id:
            return jsonify({'error': 'Nome e supervisor são obrigatórios'}), 400
        
        # Verificar se o supervisor existe e é discipulador
        supervisor = User.query.get(supervisor_id)
        if not supervisor or supervisor.role not in ['discipulador', 'pastor']:
            return jsonify({'error': 'Supervisor deve ser discipulador ou pastor'}), 400
        
        new_network = Network(
            name=name,
            description=description,
            supervisor_id=supervisor_id
        )
        
        db.session.add(new_network)
        db.session.commit()
        
        return jsonify({
            'message': 'Rede criada com sucesso',
            'network': new_network.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@networks_bp.route('/<int:network_id>', methods=['PUT'])
def update_network(network_id):
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        network = Network.query.get_or_404(network_id)
        
        # Verificar permissões
        if current_user.role == 'pastor' or network.supervisor_id == current_user.id:
            pass  # Pode editar
        else:
            return jsonify({'error': 'Sem permissão para editar esta rede'}), 403
        
        data = request.get_json()
        
        if 'name' in data:
            network.name = data['name']
        if 'description' in data:
            network.description = data['description']
        if 'supervisor_id' in data and current_user.role == 'pastor':
            supervisor = User.query.get(data['supervisor_id'])
            if supervisor and supervisor.role in ['discipulador', 'pastor']:
                network.supervisor_id = data['supervisor_id']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Rede atualizada com sucesso',
            'network': network.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@networks_bp.route('/<int:network_id>', methods=['DELETE'])
def delete_network(network_id):
    try:
        current_user = check_auth()
        if not current_user or current_user.role != 'pastor':
            return jsonify({'error': 'Apenas pastores podem excluir redes'}), 403
        
        network = Network.query.get_or_404(network_id)
        network.is_active = False
        
        db.session.commit()
        
        return jsonify({'message': 'Rede desativada com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

