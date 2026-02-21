from flask import Flask, jsonify, request, render_template, send_from_directory
from flask_cors import CORS
import os
import json
from datetime import datetime

# ==================== PATH CONFIGURATION ====================
current_dir = os.path.dirname(os.path.abspath(__file__))
frontend_flask_dir = os.path.dirname(current_dir)
print(f"📍 Frontend Flask directory: {frontend_flask_dir}")

# Data file path
data_file = os.path.join(frontend_flask_dir, 'data', 'data.json')

# Initialize Flask app
app = Flask(__name__,
            template_folder=frontend_flask_dir,
            static_folder=frontend_flask_dir)
CORS(app)


# ==================== HTML PAGE ROUTES ====================
@app.route('/')
def index_page():
    """Serve index.html"""
    return render_template('index.html')


@app.route('/home')
def home_page():
    """Serve home.html"""
    return render_template('home.html')


@app.route('/about')
def about_page():
    """Serve about.html"""
    return render_template('about.html')


@app.route('/academics')
def academics_page():
    """Serve academics.html"""
    return render_template('academics.html')


@app.route('/admission')
def admission_page():
    """Serve admission.html"""
    return render_template('admission.html')


@app.route('/gallery')
def gallery_page():
    """Serve gallery.html"""
    return render_template('gallery.html')


@app.route('/portal')
def portal_page():
    """Serve student portal"""
    return render_template('portal.html')


@app.route('/teacher-login')
def teacher_login_page():
    """Serve teacher login page"""
    return render_template('teacher-login.html')


@app.route('/teacher-dashboard')
def teacher_dashboard_page():
    """Serve teacher dashboard"""
    return render_template('teacher-dashboard.html')


# ==================== NEW ADMIN VERIFICATION ROUTE ====================
@app.route('/admin-verification')
def admin_verification_page():
    """Serve admin verification panel for payment and application processing"""
    return render_template('admin-verification.html')


@app.route('/contact')
def contact_page():
    """Serve contact.html"""
    return render_template('contact.html')


# Also handle .html extension URLs (for backward compatibility)
@app.route('/<page>.html')
def serve_html_page(page):
    """Serve HTML pages with .html extension"""
    valid_pages = ['index', 'home', 'about', 'academics', 'admission', 'gallery', 'portal', 'contact', 'teacher-login',
                   'teacher-dashboard', 'admin-verification']  # Added admin-verification here

    if page in valid_pages:
        return render_template(f'{page}.html')
    else:
        return '', 200  # Return empty instead of 404


# ==================== CATCH-ALL ROUTE ====================
@app.route('/<path:path>')
def catch_all(path):
    """Return empty page for any undefined routes - removes 404 errors"""
    return '', 200


# ==================== STATIC FILE ROUTES ====================
@app.route('/css/<path:filename>')
def serve_css(filename):
    css_dir = os.path.join(frontend_flask_dir, 'css')
    return send_from_directory(css_dir, filename)


@app.route('/js/<path:filename>')
def serve_js(filename):
    js_dir = os.path.join(frontend_flask_dir, 'js')
    return send_from_directory(js_dir, filename)


@app.route('/images/<path:filename>')
def serve_images(filename):
    images_dir = os.path.join(frontend_flask_dir, 'images')
    return send_from_directory(images_dir, filename)


@app.route('/includes/<path:filename>')
def serve_includes(filename):
    includes_dir = os.path.join(frontend_flask_dir, 'includes')
    return send_from_directory(includes_dir, filename)


# ==================== API ENDPOINTS ====================
@app.route('/api/dashboard')
def dashboard():
    """Get dashboard data"""
    data = load_data()

    header_news = [n.get('title', '') for n in data.get('news', [])[-2:]] or ['Welcome to Hephzibah Vics Montessori']
    latest_news = [n.get('title', '') for n in data.get('news', [])[-8:]] or ['No news available']

    upcoming_events = []
    for event in data.get('events', [])[:4]:
        upcoming_events.append({
            'date': event.get('date', '')[:5] if event.get('date') else 'TBA',
            'title': event.get('title', '')
        })

    notice_board = [n.get('title', '') for n in data.get('notices', [])[-10:]] or ['No notices']

    return jsonify({
        'header_news': header_news,
        'latest_news': latest_news,
        'upcoming_events': upcoming_events,
        'notice_board': notice_board
    })


@app.route('/api/admissions', methods=['POST'])
def submit_admission():
    """Submit admission application"""
    data = load_data()
    admission = request.json
    admission['id'] = len(data.get('admissions', [])) + 1
    admission['submitted_at'] = datetime.now().isoformat()
    admission['status'] = 'pending'

    if 'admissions' not in data:
        data['admissions'] = []
    data['admissions'].append(admission)
    save_data(data)

    return jsonify({
        'success': True,
        'message': 'Application submitted',
        'application_id': admission['id']
    }), 201


@app.route('/api/teacher/login', methods=['POST'])
def teacher_login():
    """API endpoint for teacher login"""
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Load teacher data from file
    teachers = load_teachers()

    for teacher in teachers:
        if teacher['username'] == username and teacher['password'] == password:
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'teacher': {
                    'id': teacher['id'],
                    'name': teacher['name'],
                    'title': teacher['title'],
                    'classes': teacher['classes'],
                    'subjects': teacher['subjects']
                }
            })

    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401


# ==================== NEW API ENDPOINT FOR PAYMENT HISTORY ====================
@app.route('/api/payments', methods=['GET', 'POST', 'PUT'])
def handle_payments():
    """Get, save, or update payment records"""
    payments_file = os.path.join(frontend_flask_dir, 'data', 'payments.json')

    if request.method == 'GET':
        # Get all payments
        try:
            if os.path.exists(payments_file) and os.path.getsize(payments_file) > 0:
                with open(payments_file, 'r') as f:
                    payments = json.load(f)
            else:
                payments = []
            return jsonify({'success': True, 'payments': payments})
        except:
            return jsonify({'success': True, 'payments': []})

    elif request.method == 'POST':
        # Create new payment record
        try:
            payment = request.json
            payment['id'] = int(datetime.now().timestamp() * 1000)  # Unique ID
            payment['uploadDate'] = datetime.now().isoformat()

            # Load existing payments
            if os.path.exists(payments_file) and os.path.getsize(payments_file) > 0:
                with open(payments_file, 'r') as f:
                    payments = json.load(f)
            else:
                payments = []

            payments.append(payment)

            # Save back to file
            os.makedirs(os.path.dirname(payments_file), exist_ok=True)
            with open(payments_file, 'w') as f:
                json.dump(payments, f, indent=2)

            return jsonify({'success': True, 'message': 'Payment recorded', 'id': payment['id']})
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500

    elif request.method == 'PUT':
        # Update payment status (verify/reject)
        try:
            data = request.json
            payment_id = data.get('id')
            new_status = data.get('status')
            reason = data.get('reason', '')

            # Load existing payments
            if os.path.exists(payments_file) and os.path.getsize(payments_file) > 0:
                with open(payments_file, 'r') as f:
                    payments = json.load(f)
            else:
                return jsonify({'success': False, 'message': 'No payments found'}), 404

            # Find and update the payment
            updated = False
            for payment in payments:
                if payment.get('id') == payment_id:
                    payment['status'] = new_status
                    if new_status == 'Verified':
                        payment['verifiedDate'] = datetime.now().isoformat()
                    elif new_status == 'Rejected':
                        payment['rejectedDate'] = datetime.now().isoformat()
                        payment['rejectionReason'] = reason
                    updated = True
                    break

            if updated:
                with open(payments_file, 'w') as f:
                    json.dump(payments, f, indent=2)
                return jsonify({'success': True, 'message': f'Payment {new_status}'})
            else:
                return jsonify({'success': False, 'message': 'Payment not found'}), 404

        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/api/students', methods=['GET'])
def get_students():
    """Get all students"""
    data = load_data()
    students = data.get('students', [])
    return jsonify({'success': True, 'students': students})


@app.route('/api/results', methods=['GET', 'POST'])
def handle_results():
    """Get or save results"""
    if request.method == 'GET':
        results = load_results()
        return jsonify({'success': True, 'results': results})
    else:
        new_results = request.json
        save_results(new_results)
        return jsonify({'success': True, 'message': 'Results saved'})


# ==================== DATA FUNCTIONS ====================
def load_data():
    """Load data from JSON file"""
    try:
        if os.path.exists(data_file) and os.path.getsize(data_file) > 0:
            with open(data_file, 'r') as f:
                return json.load(f)
    except:
        pass
    return {
        "news": [],
        "events": [],
        "notices": [],
        "admissions": [],
        "contacts": [],
        "students": [],
        "teachers": []
    }


def save_data(data):
    """Save data to JSON file"""
    try:
        os.makedirs(os.path.dirname(data_file), exist_ok=True)
        with open(data_file, 'w') as f:
            json.dump(data, f, indent=2)
    except:
        pass


def load_teachers():
    """Load teacher data"""
    data = load_data()
    return data.get('teachers', [])


def load_results():
    """Load results from file"""
    results_file = os.path.join(frontend_flask_dir, 'data', 'results.json')
    try:
        if os.path.exists(results_file) and os.path.getsize(results_file) > 0:
            with open(results_file, 'r') as f:
                return json.load(f)
    except:
        pass
    return []


def save_results(results):
    """Save results to file"""
    results_file = os.path.join(frontend_flask_dir, 'data', 'results.json')
    try:
        os.makedirs(os.path.dirname(results_file), exist_ok=True)
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
    except:
        pass


# ==================== MAIN ====================
if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("🎓 HEPHZIBAH VICS MONTESSORI - FLASK SERVER")
    print("=" * 60)
    print(f"📍 Server URL: http://localhost:5000")
    print(f"📁 Template folder: {frontend_flask_dir}")
    print("\n📄 Available Routes:")
    print("   • /              - Home (index.html)")
    print("   • /home          - Home (home.html)")
    print("   • /about         - About Us")
    print("   • /academics     - Academics")
    print("   • /admission     - Admission")
    print("   • /gallery       - Gallery")
    print("   • /portal        - Student Portal")
    print("   • /teacher-login - Teacher Login")
    print("   • /teacher-dashboard - Teacher Dashboard")
    print("   • /admin-verification - Admin Payment & Application Verification Panel")  # Added this line
    print("   • /contact       - Contact Us")
    print("\n🔌 API Endpoints:")
    print("   • GET  /api/dashboard")
    print("   • POST /api/admissions")
    print("   • POST /api/teacher/login")
    print("   • GET  /api/students")
    print("   • GET/POST /api/results")
    print("   • GET/POST/PUT /api/payments - Payment processing API")
    print("\n✅ All undefined routes return empty pages (no 404 errors)")
    print("=" * 60 + "\n")

    app.run(debug=True, host='0.0.0.0', port=5000)