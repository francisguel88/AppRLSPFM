#!/usr/bin/env python3
"""
Script para inicializar dados de exemplo no banco de dados
"""
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from src.main import app
from src.models.models import db, User, Network, Cell, Member
from datetime import datetime

def init_sample_data():
    with app.app_context():
        # Limpar dados existentes
        db.drop_all()
        db.create_all()
        
        print("Criando usuários de exemplo...")
        
        # Criar pastor admin
        pastor = User(
            username='pastor_admin',
            email='pastor@videira.com.br',
            full_name='Pastor Administrador',
            role='pastor'
        )
        pastor.set_password('admin123')
        db.session.add(pastor)
        
        # Criar discipuladores
        discipulador1 = User(
            username='discipulador1',
            email='disc1@videira.com.br',
            full_name='João Discipulador',
            role='discipulador'
        )
        discipulador1.set_password('disc123')
        db.session.add(discipulador1)
        
        discipulador2 = User(
            username='discipulador2',
            email='disc2@videira.com.br',
            full_name='Maria Discipuladora',
            role='discipulador'
        )
        discipulador2.set_password('disc123')
        db.session.add(discipulador2)
        
        # Criar líderes
        lider1 = User(
            username='lider1',
            email='lider1@videira.com.br',
            full_name='Pedro Líder',
            role='lider'
        )
        lider1.set_password('lider123')
        db.session.add(lider1)
        
        lider2 = User(
            username='lider2',
            email='lider2@videira.com.br',
            full_name='Ana Líder',
            role='lider'
        )
        lider2.set_password('lider123')
        db.session.add(lider2)
        
        lider3 = User(
            username='lider3',
            email='lider3@videira.com.br',
            full_name='Carlos Líder',
            role='lider'
        )
        lider3.set_password('lider123')
        db.session.add(lider3)
        
        db.session.commit()
        
        print("Criando redes de exemplo...")
        
        # Criar redes
        networks_data = [
            {'name': 'Reset', 'description': 'Rede Reset - Renovação e recomeço', 'supervisor_id': discipulador1.id},
            {'name': 'Revayah', 'description': 'Rede Revayah - Satisfação em Deus', 'supervisor_id': discipulador1.id},
            {'name': 'Tetelestai', 'description': 'Rede Tetelestai - Está consumado', 'supervisor_id': discipulador2.id},
            {'name': 'Kadosh', 'description': 'Rede Kadosh - Santo', 'supervisor_id': discipulador2.id},
            {'name': 'Ekbalo', 'description': 'Rede Ekbalo - Enviar', 'supervisor_id': discipulador1.id},
            {'name': 'Nazireus', 'description': 'Rede Nazireus - Separado para Deus', 'supervisor_id': discipulador2.id},
            {'name': 'Nexteens', 'description': 'Rede Nexteens - Próxima geração', 'supervisor_id': discipulador1.id}
        ]
        
        networks = []
        for net_data in networks_data:
            network = Network(**net_data)
            networks.append(network)
            db.session.add(network)
        
        db.session.commit()
        
        print("Criando células de exemplo...")
        
        # Criar células
        cells_data = [
            {'name': 'Célula Esperança', 'leader_id': lider1.id, 'network_id': networks[0].id, 'meeting_day': 'Terça-feira', 'meeting_time': '19:30', 'location': 'Casa do Pedro'},
            {'name': 'Célula Vitória', 'leader_id': lider2.id, 'network_id': networks[1].id, 'meeting_day': 'Quinta-feira', 'meeting_time': '20:00', 'location': 'Casa da Ana'},
            {'name': 'Célula Fé', 'leader_id': lider3.id, 'network_id': networks[2].id, 'meeting_day': 'Sexta-feira', 'meeting_time': '19:00', 'location': 'Casa do Carlos'},
        ]
        
        cells = []
        for cell_data in cells_data:
            cell = Cell(**cell_data)
            cells.append(cell)
            db.session.add(cell)
        
        db.session.commit()
        
        print("Criando membros de exemplo...")
        
        # Criar membros
        members_data = [
            # Célula Esperança
            {'full_name': 'José Silva', 'phone': '(11) 99999-1001', 'email': 'jose@email.com', 'member_type': 'membro', 'cell_id': cells[0].id},
            {'full_name': 'Maria Santos', 'phone': '(11) 99999-1002', 'email': 'maria@email.com', 'member_type': 'membro', 'cell_id': cells[0].id},
            {'full_name': 'João Oliveira', 'phone': '(11) 99999-1003', 'email': 'joao@email.com', 'member_type': 'fa', 'cell_id': cells[0].id},
            
            # Célula Vitória
            {'full_name': 'Ana Costa', 'phone': '(11) 99999-2001', 'email': 'ana@email.com', 'member_type': 'membro', 'cell_id': cells[1].id},
            {'full_name': 'Paulo Ferreira', 'phone': '(11) 99999-2002', 'email': 'paulo@email.com', 'member_type': 'membro', 'cell_id': cells[1].id},
            {'full_name': 'Carla Rodrigues', 'phone': '(11) 99999-2003', 'email': 'carla@email.com', 'member_type': 'fa', 'cell_id': cells[1].id},
            
            # Célula Fé
            {'full_name': 'Roberto Lima', 'phone': '(11) 99999-3001', 'email': 'roberto@email.com', 'member_type': 'membro', 'cell_id': cells[2].id},
            {'full_name': 'Fernanda Alves', 'phone': '(11) 99999-3002', 'email': 'fernanda@email.com', 'member_type': 'membro', 'cell_id': cells[2].id},
            {'full_name': 'Diego Martins', 'phone': '(11) 99999-3003', 'email': 'diego@email.com', 'member_type': 'fa', 'cell_id': cells[2].id},
        ]
        
        for member_data in members_data:
            member = Member(**member_data)
            db.session.add(member)
        
        db.session.commit()
        
        print("Dados de exemplo criados com sucesso!")
        print("\nCredenciais de acesso:")
        print("Pastor Admin: pastor_admin / admin123")
        print("Discipulador 1: discipulador1 / disc123")
        print("Discipulador 2: discipulador2 / disc123")
        print("Líder 1: lider1 / lider123")
        print("Líder 2: lider2 / lider123")
        print("Líder 3: lider3 / lider123")

if __name__ == '__main__':
    init_sample_data()

