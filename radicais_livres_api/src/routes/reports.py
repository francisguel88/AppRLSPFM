from flask import Blueprint, request, jsonify, session
from src.models.models import db, AttendanceReport, Attendance, Cell, Member, User
from datetime import datetime, date

reports_bp = Blueprint('reports', __name__)

def check_auth():
    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.get(user_id)

@reports_bp.route('/', methods=['GET'])
def get_reports():
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        cell_id = request.args.get('cell_id')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = AttendanceReport.query
        
        if cell_id:
            query = query.filter_by(cell_id=cell_id)
        
        if start_date:
            query = query.filter(AttendanceReport.meeting_date >= datetime.strptime(start_date, '%Y-%m-%d').date())
        
        if end_date:
            query = query.filter(AttendanceReport.meeting_date <= datetime.strptime(end_date, '%Y-%m-%d').date())
        
        # Filtrar por permissões
        if current_user.role == 'pastor':
            # Pastor vê todos os relatórios
            pass
        elif current_user.role == 'discipulador':
            # Discipulador vê relatórios das células das suas redes
            network_ids = [network.id for network in current_user.supervised_networks]
            cell_ids = [cell.id for cell in Cell.query.filter(Cell.network_id.in_(network_ids)).all()]
            query = query.join(Cell).filter(Cell.id.in_(cell_ids))
        else:
            # Líder vê apenas relatórios das suas células
            cell_ids = [cell.id for cell in current_user.led_cells]
            query = query.filter(AttendanceReport.cell_id.in_(cell_ids))
        
        reports = query.order_by(AttendanceReport.meeting_date.desc()).all()
        
        return jsonify({
            'reports': [report.to_dict() for report in reports]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/', methods=['POST'])
def create_report():
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        data = request.get_json()
        cell_id = data.get('cell_id')
        meeting_date = data.get('meeting_date')
        observations = data.get('observations', '')
        testimony = data.get('testimony', '')
        attendances = data.get('attendances', [])  # Lista de presenças
        
        if not all([cell_id, meeting_date]):
            return jsonify({'error': 'Célula e data da reunião são obrigatórios'}), 400
        
        # Verificar se a célula existe e se o usuário tem permissão
        cell = Cell.query.get(cell_id)
        if not cell or not cell.is_active:
            return jsonify({'error': 'Célula não encontrada'}), 404
        
        can_create = False
        if current_user.role == 'pastor':
            can_create = True
        elif current_user.role == 'discipulador' and cell.network.supervisor_id == current_user.id:
            can_create = True
        elif current_user.role == 'lider' and cell.leader_id == current_user.id:
            can_create = True
        
        if not can_create:
            return jsonify({'error': 'Sem permissão para criar relatórios para esta célula'}), 403
        
        # Converter string de data
        try:
            meeting_date = datetime.strptime(meeting_date, '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        # Verificar se já existe relatório para esta célula nesta data
        existing_report = AttendanceReport.query.filter_by(
            cell_id=cell_id,
            meeting_date=meeting_date
        ).first()
        
        if existing_report:
            return jsonify({'error': 'Já existe relatório para esta célula nesta data'}), 409
        
        # Contar presenças por tipo
        members_present = len([a for a in attendances if a.get('attendance_type') == 'membro'])
        fas_present = len([a for a in attendances if a.get('attendance_type') == 'fa'])
        visitors_present = len([a for a in attendances if a.get('attendance_type') == 'visitante'])
        
        # Criar relatório
        new_report = AttendanceReport(
            cell_id=cell_id,
            meeting_date=meeting_date,
            members_present=members_present,
            fas_present=fas_present,
            visitors_present=visitors_present,
            observations=observations,
            testimony=testimony,
            created_by=current_user.id
        )
        
        db.session.add(new_report)
        db.session.flush()  # Para obter o ID do relatório
        
        # Criar registros de presença
        for attendance_data in attendances:
            attendance = Attendance(
                report_id=new_report.id,
                member_id=attendance_data.get('member_id'),
                visitor_name=attendance_data.get('visitor_name'),
                attendance_type=attendance_data.get('attendance_type')
            )
            db.session.add(attendance)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Relatório criado com sucesso',
            'report': new_report.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/<int:report_id>', methods=['GET'])
def get_report_details(report_id):
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        report = AttendanceReport.query.get_or_404(report_id)
        
        # Verificar permissões
        can_view = False
        if current_user.role == 'pastor':
            can_view = True
        elif current_user.role == 'discipulador' and report.cell.network.supervisor_id == current_user.id:
            can_view = True
        elif current_user.role == 'lider' and report.cell.leader_id == current_user.id:
            can_view = True
        
        if not can_view:
            return jsonify({'error': 'Sem permissão para visualizar este relatório'}), 403
        
        # Buscar detalhes das presenças
        attendances = Attendance.query.filter_by(report_id=report_id).all()
        
        report_data = report.to_dict()
        report_data['attendances'] = [attendance.to_dict() for attendance in attendances]
        
        return jsonify({'report': report_data}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/<int:report_id>', methods=['PUT'])
def update_report(report_id):
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        report = AttendanceReport.query.get_or_404(report_id)
        
        # Verificar permissões
        can_edit = False
        if current_user.role == 'pastor':
            can_edit = True
        elif current_user.role == 'discipulador' and report.cell.network.supervisor_id == current_user.id:
            can_edit = True
        elif current_user.role == 'lider' and report.cell.leader_id == current_user.id:
            can_edit = True
        
        if not can_edit:
            return jsonify({'error': 'Sem permissão para editar este relatório'}), 403
        
        data = request.get_json()
        
        if 'observations' in data:
            report.observations = data['observations']
        if 'testimony' in data:
            report.testimony = data['testimony']
        
        # Atualizar presenças se fornecidas
        if 'attendances' in data:
            # Remover presenças antigas
            Attendance.query.filter_by(report_id=report_id).delete()
            
            # Adicionar novas presenças
            attendances = data['attendances']
            members_present = len([a for a in attendances if a.get('attendance_type') == 'membro'])
            fas_present = len([a for a in attendances if a.get('attendance_type') == 'fa'])
            visitors_present = len([a for a in attendances if a.get('attendance_type') == 'visitante'])
            
            report.members_present = members_present
            report.fas_present = fas_present
            report.visitors_present = visitors_present
            
            for attendance_data in attendances:
                attendance = Attendance(
                    report_id=report_id,
                    member_id=attendance_data.get('member_id'),
                    visitor_name=attendance_data.get('visitor_name'),
                    attendance_type=attendance_data.get('attendance_type')
                )
                db.session.add(attendance)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Relatório atualizado com sucesso',
            'report': report.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/<int:report_id>', methods=['DELETE'])
def delete_report(report_id):
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        report = AttendanceReport.query.get_or_404(report_id)
        
        # Verificar permissões (apenas pastores e discipuladores podem excluir)
        can_delete = False
        if current_user.role == 'pastor':
            can_delete = True
        elif current_user.role == 'discipulador' and report.cell.network.supervisor_id == current_user.id:
            can_delete = True
        
        if not can_delete:
            return jsonify({'error': 'Sem permissão para excluir este relatório'}), 403
        
        # Excluir presenças associadas
        Attendance.query.filter_by(report_id=report_id).delete()
        
        # Excluir relatório
        db.session.delete(report)
        db.session.commit()
        
        return jsonify({'message': 'Relatório excluído com sucesso'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@reports_bp.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    try:
        current_user = check_auth()
        if not current_user:
            return jsonify({'error': 'Usuário não autenticado'}), 401
        
        # Dados do dashboard baseados no perfil do usuário
        data = {}
        
        if current_user.role == 'pastor':
            # Estatísticas gerais
            total_cells = Cell.query.filter_by(is_active=True).count()
            total_members = Member.query.filter_by(is_active=True, member_type='membro').count()
            total_networks = db.session.query(Cell.network_id).filter(Cell.is_active == True).distinct().count()
            
            # Relatórios recentes
            recent_reports = AttendanceReport.query.order_by(AttendanceReport.created_at.desc()).limit(5).all()
            
        elif current_user.role == 'discipulador':
            # Estatísticas das redes supervisionadas
            network_ids = [network.id for network in current_user.supervised_networks]
            cells = Cell.query.filter(Cell.network_id.in_(network_ids), Cell.is_active == True).all()
            cell_ids = [cell.id for cell in cells]
            
            total_cells = len(cells)
            total_members = Member.query.filter(Member.cell_id.in_(cell_ids), Member.is_active == True, Member.member_type == 'membro').count()
            total_networks = len(current_user.supervised_networks)
            
            # Relatórios recentes das células supervisionadas
            recent_reports = AttendanceReport.query.filter(AttendanceReport.cell_id.in_(cell_ids)).order_by(AttendanceReport.created_at.desc()).limit(5).all()
            
        else:  # líder
            # Estatísticas das células lideradas
            cells = current_user.led_cells
            cell_ids = [cell.id for cell in cells if cell.is_active]
            
            total_cells = len([cell for cell in cells if cell.is_active])
            total_members = Member.query.filter(Member.cell_id.in_(cell_ids), Member.is_active == True, Member.member_type == 'membro').count()
            total_networks = len(set([cell.network_id for cell in cells if cell.is_active]))
            
            # Relatórios recentes das células lideradas
            recent_reports = AttendanceReport.query.filter(AttendanceReport.cell_id.in_(cell_ids)).order_by(AttendanceReport.created_at.desc()).limit(5).all()
        
        data = {
            'total_cells': total_cells,
            'total_members': total_members,
            'total_networks': total_networks,
            'recent_reports': [report.to_dict() for report in recent_reports]
        }
        
        return jsonify(data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

