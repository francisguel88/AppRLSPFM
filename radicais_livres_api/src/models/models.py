from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(150), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='lider')  # lider, discipulador, pastor
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    led_cells = db.relationship('Cell', backref='leader', lazy=True, foreign_keys='Cell.leader_id')
    supervised_networks = db.relationship('Network', backref='supervisor', lazy=True, foreign_keys='Network.supervisor_id')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Network(db.Model):
    __tablename__ = 'networks'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)  # Reset, Revayah, Tetelestai, Kadosh, Ekbalo, Nazireus, Nexteens
    description = db.Column(db.Text)
    supervisor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    cells = db.relationship('Cell', backref='network', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'supervisor_id': self.supervisor_id,
            'supervisor_name': self.supervisor.full_name if self.supervisor else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'cells_count': len(self.cells)
        }

class Cell(db.Model):
    __tablename__ = 'cells'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    leader_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    network_id = db.Column(db.Integer, db.ForeignKey('networks.id'), nullable=False)
    meeting_day = db.Column(db.String(20))  # Segunda, Terça, etc.
    meeting_time = db.Column(db.String(10))  # HH:MM
    location = db.Column(db.String(200))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    attendance_reports = db.relationship('AttendanceReport', backref='cell', lazy=True)
    members = db.relationship('Member', backref='cell', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'leader_id': self.leader_id,
            'leader_name': self.leader.full_name if self.leader else None,
            'network_id': self.network_id,
            'network_name': self.network.name if self.network else None,
            'meeting_day': self.meeting_day,
            'meeting_time': self.meeting_time,
            'location': self.location,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'members_count': len(self.members)
        }

class Member(db.Model):
    __tablename__ = 'members'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    member_type = db.Column(db.String(20), nullable=False)  # membro, fa, visitante
    cell_id = db.Column(db.Integer, db.ForeignKey('cells.id'), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'phone': self.phone,
            'email': self.email,
            'member_type': self.member_type,
            'cell_id': self.cell_id,
            'cell_name': self.cell.name if self.cell else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class AttendanceReport(db.Model):
    __tablename__ = 'attendance_reports'
    
    id = db.Column(db.Integer, primary_key=True)
    cell_id = db.Column(db.Integer, db.ForeignKey('cells.id'), nullable=False)
    meeting_date = db.Column(db.Date, nullable=False)
    members_present = db.Column(db.Integer, default=0)
    fas_present = db.Column(db.Integer, default=0)
    visitors_present = db.Column(db.Integer, default=0)
    observations = db.Column(db.Text)
    testimony = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    attendances = db.relationship('Attendance', backref='report', lazy=True, cascade='all, delete-orphan')
    creator = db.relationship('User', backref='created_reports', foreign_keys=[created_by])

    def to_dict(self):
        return {
            'id': self.id,
            'cell_id': self.cell_id,
            'cell_name': self.cell.name if self.cell else None,
            'network_name': self.cell.network.name if self.cell and self.cell.network else None,
            'leader_name': self.cell.leader.full_name if self.cell and self.cell.leader else None,
            'meeting_date': self.meeting_date.isoformat() if self.meeting_date else None,
            'members_present': self.members_present,
            'fas_present': self.fas_present,
            'visitors_present': self.visitors_present,
            'total_present': self.members_present + self.fas_present + self.visitors_present,
            'observations': self.observations,
            'testimony': self.testimony,
            'created_by': self.created_by,
            'creator_name': self.creator.full_name if self.creator else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Attendance(db.Model):
    __tablename__ = 'attendances'
    
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey('attendance_reports.id'), nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id'), nullable=True)
    visitor_name = db.Column(db.String(150))  # Para visitantes que não são membros cadastrados
    attendance_type = db.Column(db.String(20), nullable=False)  # membro, fa, visitante
    
    # Relacionamentos
    member = db.relationship('Member', backref='attendances')

    def to_dict(self):
        return {
            'id': self.id,
            'report_id': self.report_id,
            'member_id': self.member_id,
            'member_name': self.member.full_name if self.member else self.visitor_name,
            'attendance_type': self.attendance_type
        }

class Photo(db.Model):
    __tablename__ = 'photos'
    
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_date = db.Column(db.Date)
    cell_id = db.Column(db.Integer, db.ForeignKey('cells.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    uploader = db.relationship('User', backref='uploaded_photos')
    cell = db.relationship('Cell', backref='photos')

    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'description': self.description,
            'uploaded_by': self.uploaded_by,
            'uploader_name': self.uploader.full_name if self.uploader else None,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'cell_id': self.cell_id,
            'cell_name': self.cell.name if self.cell else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

