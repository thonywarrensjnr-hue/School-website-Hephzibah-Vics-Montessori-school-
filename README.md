# School-website-Hephzibah-Vics-Montessori-school-
A comprehensive school management system for Hephzibah Vics Montessori featuring separate portals for students, teachers etc. The system handles online admissions with school fee payments, result management and an admin verification panel for processing applications and payments. Built with Flask, HTML, CSS, and JavaScript.

🎓 Hephzibah Vics Montessori School Management System

A comprehensive school management system with separate portals for students, teachers, and administrators. Built with HTML, CSS, JavaScript, and Flask.

https://img.shields.io/badge/version-1.0.0-blue.svg
https://img.shields.io/badge/license-MIT-green.svg
📋 Overview

This web application provides a complete school management solution for Hephzibah Vics Montessori, featuring:

    Public-facing website with school information and admission process

    Student Portal for viewing results and paying fees

    Teacher Portal for managing student grades and assessments

    Admin Verification Panel for processing payments and admission applications

✨ Features
🏫 Public Pages

    Home - School overview and announcements

    About Us - School information and philosophy

    Academics - Curriculum and program details

    Admission - Online application with mandatory receipt upload

    Gallery - School photos and events

    Contact Us - Contact information and inquiry form

👨‍🎓 Student Portal

    Secure login with student ID

    View academic results by term

    Psychomotor assessment viewing

    School fees payment with receipt upload

    Payment history tracking

👩‍🏫 Teacher Portal

    Individual teacher login credentials

    Dashboard for assigned classes

    Enter and manage student results

    Enter psychomotor assessments

👑 Admin Verification Panel

    Dual Section Management:

        School Fees Payments verification

        Admission Applications processing

    Statistics dashboard (pending/verified/rejected counts)

    Search and filter functionality

    Receipt image viewing

    Verify/reject applications and payments

    Export to CSV reports

💳 Payment Processing

    Bank transfer instructions

    Receipt upload with image preview

    Pending verification status

    Email confirmation simulation

🛠️ Technology Stack

    Frontend: HTML5, CSS3, JavaScript

    Backend: Python Flask

    Icons: Font Awesome 6

    Data Storage: JSON files (server) + localStorage (client)

    Styling: Custom CSS with responsive design

📁 Project Structure
text

hephzibah-vics-montessori/
├── app.py                          # Flask application
├── requirements.txt                # Python dependencies
├── README.md                       # This file
├── data/                           # JSON data storage
│   ├── data.json                   # General data
│   ├── admissions.json             # Admission applications
│                
├── css/
│   └── style.css                   # Main stylesheet
├── js/
│   └── main.js                     # Main JavaScript
├── images/                         # Image assets
└── templates/                      # HTML templates
    ├── index.html                  # Home page
    ├── about.html                  # About Us
    ├── academics.html              # Academics
    ├── admission.html              # Admission form
    ├── gallery.html                # Gallery
    ├── contact.html                # Contact
    ├── portal.html                 # Student portal
    ├── teacher-login.html          # Teacher login
    ├── teacher-dashboard.html      # Teacher dashboard
    └── admin-verification.html      # Admin panel

🚀 Installation & Setup
Prerequisites

    Python 3.8 or higher

    pip (Python package manager)

Step-by-Step Installation

    Clone the repository
    bash

    git clone https://github.com/yourusername/hephzibah-vics-montessori.git
    cd hephzibah-vics-montessori

    Install dependencies
    bash

    pip install -r requirements.txt

    Create required directories
    bash

    mkdir -p data

    Run the application
    bash

    python app.py

    Access the website

        Open your browser and navigate to: http://localhost:5000

🔑 Default Login Credentials
Students
Student ID	Password	Class
STU001	password123	Grade 1a
STU002	password123	Grade 1a
STU003	password123	Grade 1a
... up to STU014	password123	Various
Teachers
Username	Password	Class
mrs_igwe	igwe123	Lily
mrs_eromonsele	eromonsele123	Buttercup
mrs_odjoh	odjoh123	Infant foundation 1
mrs_warrens	warrens123	Infant foundation 2
mr_solomon	solomon123	Grade 1a
mrs_olusuno	olusuno123	Grade 1b
mrs_peters	peters123	Grade 2
mrs_adesuwa	adesuwa123	Grade 3
mr_p	pere123	Grade 4
mrs_daniels	daniels123	Grade 5
mrs_cynthia	cynthia123	JSS 1
mr_john	john123	JSS 2
Admin

    Admin Code: hephzibah2026

📱 Responsive Design

The website is fully responsive and works on:

    Desktop computers

    Tablets

    Mobile phones

🔒 Security Features

    Session-based authentication

    Admin-only verification panel

    Separate login systems for students and teachers

    Receipt validation and size limits

    Data persistence through JSON files

💾 Data Storage

The system uses two storage methods:

    Server-side: JSON files in the /data directory for persistent storage

    Client-side: Browser localStorage for temporary data

🧪 Testing

To test the complete workflow:

    Student Application Flow:

        Go to Admission page

        Fill form and upload a test receipt

        Login to Admin panel to verify

    School Fees Payment Flow:

        Login as student

        Go to School Fees section

        Upload receipt

        Admin verifies payment

    Result Management Flow:

        Login as teacher

        Enter results for students

        Student views results in portal
