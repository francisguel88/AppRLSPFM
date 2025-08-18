from flask import Blueprint, jsonify

pastors_bp = Blueprint('pastors', __name__)

@pastors_bp.route('/', methods=['GET'])
def get_pastors():
    """Retorna informações dos pastores responsáveis"""
    try:
        pastors = [
            {
                'id': 1,
                'name': 'Pr. Marcelo Sato',
                'role': 'Pastor Supervisor',
                'description': 'Pastor supervisor da Igreja Videira em Células de Francisco Morato',
                'photo': '/api/pastors/photos/marcelo_sato.jpg',
                'contact': {
                    'email': 'marcelo.sato@videira.com.br',
                    'phone': '(11) 99999-0001'
                }
            },
            {
                'id': 2,
                'name': 'Pr. Hugo Dias',
                'role': 'Pastor de Jovens',
                'description': 'Pastor de jovens, os Radicais Livres de Francisco Morato',
                'photo': '/api/pastors/photos/hugo_dias.jpg',
                'contact': {
                    'email': 'hugo.dias@videira.com.br',
                    'phone': '(11) 99999-0002'
                }
            }
        ]
        
        return jsonify({'pastors': pastors}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pastors_bp.route('/vision', methods=['GET'])
def get_church_vision():
    """Retorna a visão da Igreja Videira"""
    try:
        vision_data = {
            'title': 'Visão da Igreja Videira',
            'vision': 'Ser uma igreja que transforma vidas através do amor de Cristo, formando discípulos que fazem discípulos.',
            'mission': 'Levar o evangelho de Jesus Cristo a todas as pessoas, desenvolvendo relacionamentos autênticos e promovendo o crescimento espiritual através das células.',
            'values': [
                'Amor incondicional',
                'Relacionamentos autênticos',
                'Crescimento espiritual',
                'Serviço ao próximo',
                'Unidade na diversidade'
            ],
            'ministry_focus': {
                'title': 'Ministério Radicais Livres',
                'description': 'O ministério de jovens Radicais Livres tem como objetivo formar jovens apaixonados por Jesus, comprometidos com o Reino de Deus e engajados na transformação da sociedade.',
                'target': 'Jovens de 15 a 30 anos',
                'activities': [
                    'Células de jovens',
                    'Eventos e retiros',
                    'Projetos sociais',
                    'Discipulado e mentoria',
                    'Adoração e louvor'
                ]
            }
        }
        
        return jsonify(vision_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

