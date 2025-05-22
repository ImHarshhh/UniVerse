import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubscribePage() {
  const navigate = useNavigate();

  const goToPlanOne = () => {
    alert('You selected the 1 Anon Post plan for ₹10');
    navigate('/planone');
  };

  const goToPlanFive = () => {
    alert('You selected the 5 Anon Posts plan for ₹40');
    navigate('/planfive');
  };

  const goToPlanTen = () => {
    alert('You selected the 10 Anon Posts plan for ₹75');
    navigate('/planten');
  };
  return (
    <>
      <style>
        {`
          .subscribe-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .title {
            text-align: center;
            font-size: 2.5rem;
            color: #222;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }

          .subtitle {
            text-align: center;
            font-size: 1.1rem;
            color: #555;
            margin-bottom: 1rem;
          }

          .divider {
            width: 80px;
            height: 4px;
            background: #6366f1;
            margin: 0 auto 2rem auto;
            border-radius: 2px;
            opacity: 0.7;
          }

          .plans {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            justify-content: center;
          }

          .plan-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            width: 280px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .plan-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
            border: 2px solid black;
          }

          .plan-title {
            text-align: center;
            font-size: 1.3rem;
            font-weight: bold;
            margin-bottom: 0.25rem;
          }

          .plan-price {
            text-align: center;
            color: #666;
            font-size: 1rem;
            margin-bottom: 1rem;
          }

          .plan-description {
            font-size: 0.95rem;
            color: #444;
            text-align: center;
            margin-bottom: 1rem;
          }

          .features {
            list-style: none;
            padding: 0;
            margin-bottom: 1.5rem;
          }

          .features li {
            display: flex;
            align-items: center;
            margin-bottom: 0.75rem;
            color: #333;
            font-size: 1rem;
          }

          .check-icon {
            color: green;
            font-weight: bold;
            margin-right: 0.5rem;
          }

          .select-btn {
            background-color: black;
            color: white;
            border: none;
            width: 100%;
            padding: 0.75rem 1rem;
            font-size: 1rem;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.3s ease;
          }

          .select-btn:hover {
            background-color: #333;
          }

          .badge {
            background: #f3f3f3;
            color: #000;
            text-align: center;
            font-weight: 600;
            font-size: 0.85rem;
            padding: 0.4rem 0;
            border-radius: 8px 8px 0 0;
            margin: -2rem -2rem 1rem -2rem;
          }
        `}
      </style>

      <section className="subscribe-container">
        <h1 className="title">Pricing</h1>
        <p className="subtitle">Choose the plan that fits your needs and start posting anonymously.</p>
        <div className="divider"></div>

        <div className="plans">
          {/* 5 Anonymous Posts Plan */}
          <div className="plan-card">
            <div className="plan-title">5 Anonymous Posts</div>
            <div className="plan-price">₹45</div>
            <p className="plan-description">Get 5 anonymous posts at a discounted rate.</p>
            <ul className="features">
              <li><span className="check-icon">✔</span>5 anonymous posts</li>
              <li><span className="check-icon">✔</span>Slight discount</li>
              <li><span className="check-icon">✔</span>Pay-per-use</li>
            </ul>
            <button className="select-btn" onClick={goToPlanFive}>
              Select
            </button>
          </div>

          {/* 1 Anonymous Post Plan */}
          <div className="plan-card center-plan">
            <div className="plan-title">1 Anonymous Post</div>
            <div className="plan-price">₹10</div>
            <p className="plan-description">Buy 1 additional anonymous post to continue posting anonymously.</p>
            <ul className="features">
              <li><span className="check-icon">✔</span>1 anonymous post</li>
              <li><span className="check-icon">✔</span>Pay-per-use</li>
              <li><span className="check-icon">✔</span>Immediate availability</li>
            </ul>
            <button className="select-btn" onClick={goToPlanOne}>
              Select
            </button>
          </div>

          {/* 10 Anonymous Posts Plan */}
          <div className="plan-card">
            <div className="plan-title">10 Anonymous Posts</div>
            <div className="plan-price">₹80</div>
            <p className="plan-description">Get 10 anonymous posts with the best value.</p>
            <ul className="features">
              <li><span className="check-icon">✔</span>10 anonymous posts</li>
              <li><span className="check-icon">✔</span>More discount</li>
              <li><span className="check-icon">✔</span>Pay-per-use</li>
            </ul>
            <button className="select-btn" onClick={goToPlanTen}>
              Select
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
