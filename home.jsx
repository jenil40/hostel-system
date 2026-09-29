import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <div className="hero text-center text-white d-flex align-items-center">
                 <Container>
                    <h1 className="display-4 fw-bold">Welcome to Hostel Management System</h1>
                    <p className="lead">Efficiently manage rooms, students, fees, and assets with ease.</p>
                </Container>
            </div>
            <section id="stats" className="stats section">
                <div className="container">
                    <div className="row gy-4">
                        <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
                            <i className="bi bi-emoji-smile" />
                            <div className="stats-item">
                                <span
                                    data-purecounter-start={0}
                                    data-purecounter-end={500}
                                    data-purecounter-duration={1}
                                    className="purecounter"
                                />
                                <p>Happy Students</p>
                            </div>
                        </div>
                        {/* End Stats Item */}
                        <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
                            <i className="bi bi-building" />
                            <div className="stats-item">
                                <span
                                    data-purecounter-start={0}
                                    data-purecounter-end={10}
                                    data-purecounter-duration={1}
                                    className="purecounter"
                                />
                                <p>Hostels Managed</p>
                            </div>
                        </div>
                        {/* End Stats Item */}
                        <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
                            <i className="bi bi-headset" />
                            <div className="stats-item">
                                <span
                                    data-purecounter-start={0}
                                    data-purecounter-end={24}
                                    data-purecounter-duration={1}
                                    className="purecounter"
                                />
                                <p>Support Hours</p>
                            </div>
                        </div>
                        {/* End Stats Item */}
                        <div className="col-lg-3 col-md-6 d-flex flex-column align-items-center">
                            <i className="bi bi-people" />
                            <div className="stats-item">
                                <span
                                    data-purecounter-start={0}
                                    data-purecounter-end={50}
                                    data-purecounter-duration={1}
                                    className="purecounter"
                                />
                                <p>Dedicated Staff</p>
                            </div>
                        </div>
                        {/* End Stats Item */}
                    </div>
                </div>
            </section>
            {/* Features Section */}
            <Container className="my-5">
                <h2 className="text-center mb-4">Key Features</h2>
                <Row>
                    {/* Feature Cards */}
                    <Col md={6} lg={4}>
                        <Card className="feature-card">
                            <Card.Body>
                                <Card.Title>Room Management</Card.Title>
                                <Card.Text>
                                    Add, edit, and manage rooms along with their status and maintenance details.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6} lg={4}>
                        <Card className="feature-card">
                            <Card.Body>
                                <Card.Title>Student Management</Card.Title>
                                <Card.Text>
                                    Store student details, assign rooms, and track student leave requests.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6} lg={4}>
                        <Card className="feature-card">
                            <Card.Body>
                                <Card.Title>Fees & Payments</Card.Title>
                                <Card.Text>
                                    Keep track of student fees, payments, and generate reports seamlessly.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6} lg={4}>
                        <Card className="feature-card">
                            <Card.Body>
                                <Card.Title>Asset Management</Card.Title>
                                <Card.Text>
                                    Maintain hostel assets, upload bills as PDFs, and manage expenses.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6} lg={4}>
                        <Card className="feature-card">
                            <Card.Body>
                                <Card.Title>Student Profiles</Card.Title>
                                <Card.Text>
                                    View student details, including profile photos and contact information.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6} lg={4}>
                        <Card className="feature-card">
                            <Card.Body>
                                <Card.Title>Hostel Dashboard</Card.Title>
                                <Card.Text>
                                    A centralized dashboard to track all hostel activities and data.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <>
                {/* About Section */}
                <section id="about" className="about section section-bg dark-background">
                    <div className="container position-relative">
                        <div className="row gy-5">
                            <div className="content col-xl-5 d-flex flex-column">
                                <h3>Efficient Hostel Management Made Simple</h3>
                                <p>
                                    Our hostel management system is designed to streamline operations,
                                    enhance student experience, and ensure smooth day-to-day management.
                                    From room allocation to leave management, we've got you covered.
                                </p>
                            </div>
                            <div className="col-xl-7">
                                <div className="row gy-4">
                                    <div className="col-md-6 icon-box position-relative">
                                        <i className="bi bi-door-open" />
                                        <h4>
                                            <a href="" className="stretched-link">
                                                Room Allocation
                                            </a>
                                        </h4>
                                        <p>
                                            Easily allocate rooms to students based on availability and
                                            preferences.
                                        </p>
                                    </div>
                                    {/* End Icon-Box */}
                                    <div className="col-md-6 icon-box position-relative">
                                        <i className="bi bi-calendar-check" />
                                        <h4>
                                            <a href="" className="stretched-link">
                                                Leave Management
                                            </a>
                                        </h4>
                                        <p>
                                            Track and approve student leave requests with just a few clicks.
                                        </p>
                                    </div>
                                    {/* End Icon-Box */}
                                    <div className="col-md-6 icon-box position-relative">
                                        <i className="bi bi-cash-coin" />
                                        <h4>
                                            <a href="" className="stretched-link">
                                                Fee Management
                                            </a>
                                        </h4>
                                        <p>Manage hostel fees, payments, and dues seamlessly.</p>
                                    </div>
                                    {/* End Icon-Box */}
                                    <div className="col-md-6 icon-box position-relative">
                                        <i className="bi bi-shield-check" />
                                        <h4>
                                            <a href="" className="stretched-link">
                                                Security &amp; Safety
                                            </a>
                                        </h4>
                                        <p>
                                            Ensure the safety of students with advanced security features.
                                        </p>
                                    </div>
                                    {/* End Icon-Box */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* /About Section */}
                {/* Stats Section */}

                {/* /Stats Section */}
                {/* Tabs Section */}
                <section id="tabs" className="tabs section">
                    <div className="container">
                        <ul className="nav nav-tabs row d-flex">
                            <li className="nav-item col-3">
                                <a
                                    className="nav-link active show"
                                    data-bs-toggle="tab"
                                    data-bs-target="#tabs-tab-1"
                                >
                                    <i className="bi bi-door-open" />
                                    <h4 className="d-none d-lg-block">Room Management</h4>
                                </a>
                            </li>
                            <li className="nav-item col-3">
                                <a
                                    className="nav-link"
                                    data-bs-toggle="tab"
                                    data-bs-target="#tabs-tab-2"
                                >
                                    <i className="bi bi-calendar-check" />
                                    <h4 className="d-none d-lg-block">Leave Tracking</h4>
                                </a>
                            </li>

                            <li className="nav-item col-3">
                                <a
                                    className="nav-link"
                                    data-bs-toggle="tab"
                                    data-bs-target="#tabs-tab-4"
                                >
                                    <i className="bi bi-shield-check" />
                                    <h4 className="d-none d-lg-block">Safety Measures</h4>
                                </a>
                            </li>
                        </ul>
                        {/* End Tab Nav */}
                        <div className="tab-content">
                            <div className="tab-pane fade active show" id="tabs-tab-1">
                                <div className="row">
                                    <div className="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0">
                                        <h3>Efficient Room Allocation</h3>
                                        <p className="fst-italic">
                                            Our system ensures that students are allocated rooms based on
                                            availability, preferences, and special requirements.
                                        </p>
                                        <ul>
                                            <li>
                                                <i className="bi bi-check2-all" />{" "}
                                                <span>Automated room allocation process.</span>
                                            </li>
                                            <li>
                                                <i className="bi bi-check2-all" />{" "}
                                                <span>Real-time availability tracking.</span>
                                            </li>
                                            <li>
                                                <i className="bi bi-check2-all" />{" "}
                                                <span>Support for special accommodations.</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-6 order-1 order-lg-2 text-center">
                                        <img
                                            src="https://content.jdmagicbox.com/comp/def_content/hostel-for-boy-students/e7551345ac-hostel-for-boy-students-5-5j8em.jpg"
                                            alt="Hostel Room"
                                            className="img-fluid"
                                            style={{ height: "250px", width: "250px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* End Tab Content Item */}
                            <div className="tab-pane fade" id="tabs-tab-2">
                                <div className="row">
                                    <div className="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0">
                                        <h3>Streamlined Leave Management</h3>
                                        <p>
                                            Track and manage student leave requests efficiently. Approve or
                                            reject requests with ease and maintain a record of all leave
                                            applications.
                                        </p>
                                        <ul>
                                            <li>
                                                <i className="bi bi-check2-all" />{" "}
                                                <span>Easy leave application process.</span>
                                            </li>

                                            <li>
                                                <i className="bi bi-check2-all" />{" "}
                                                <span>Historical leave records.</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-6 order-1 order-lg-2 text-center">
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgwWmBBL0T_jEJmigiReuQmF8wzt5ldfc7cRSnU6uKiLGAg6asHXI5Adtqg71OtfKBfRs&usqp=CAU"
                                            alt="Leave Management"
                                            className="img-fluid"
                                            style={{ height: "250px", width: "250px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* End Tab Content Item */}

                            {/* End Tab Content Item */}
                            <div className="tab-pane fade" id="tabs-tab-4">
                                <div className="row">
                                    <div className="col-lg-6 order-2 order-lg-1 mt-3 mt-lg-0">
                                        <h3>Enhanced Safety Measures</h3>
                                        <p>
                                            Ensure the safety and security of students with advanced
                                            features like CCTV monitoring, emergency alerts, and visitor
                                            tracking.
                                        </p>
                                        <ul>
                                            <li>
                                                <i className="bi bi-check2-all" />{" "}
                                                <span>24/7 CCTV surveillance.</span>
                                            </li>
                                            <li>
                                                <i className="bi bi-check2-all" />{" "}
                                                <span>Emergency alert system.</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-6 order-1 order-lg-2 text-center">
                                        <img
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA620n2mR_jTydoAEMLt-Wmmo80WfTx17iHrszh2do1DqQ25oD4d-UXxtYtVi4uKtkDVA&usqp=CAU"
                                            alt="Safety Measures"
                                            className="img-fluid"
                                            style={{ height: "250px", width: "250px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* End Tab Content Item */}
                        </div>
                    </div>
                </section>
                {/* /Tabs Section */}
            </>

            {/* Styles */}
            <style>{`
        .landing-page {
          font-family: Arial, sans-serif;
        }
        .hero {
          background: url('https://cdn.vectorstock.com/i/1000v/20/17/man-character-arrive-at-hostel-building-with-bag-vector-24502017.jpg') no-repeat center center/cover;
          height: 60vh;
        }
        .hero h1 {
          text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
        }
        .feature-card {
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border: none;
          margin-bottom: 20px;
          transition: transform 0.3s;
        }
        .feature-card:hover {
          transform: translateY(-5px);
        }
        footer {
          background: #343a40;
          margin-top: 20px;
        }
      `}</style>
        </div>
    );
};

export default LandingPage;
