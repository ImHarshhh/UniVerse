import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import qrCode from '../assets/qr-80.jpg';

const PlanTen = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const increaseAnonPostLimit = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${apiBaseUrl}/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          anonPostLimit: user?.anonPostLimit + 10,
        }),
      });

      if (res.ok) {
        setUser((prevUser) => ({
          ...prevUser,
          anonPostLimit: prevUser.anonPostLimit + 10,
        }));
        console.log("Successfully incremented anonPostLimit by 10");
      } else {
        console.error("Failed to update anonPostLimit");
      }
    } catch (error) {
      console.error("Error updating anonPostLimit:", error);
    }
  }, [user?.anonPostLimit]);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setUser(data);
          }
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        if (isMounted) {
          navigate('/login');
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      increaseAnonPostLimit();
      navigate('/new-post');
    }, 20000);

    return () => clearTimeout(timer);
  }, [user, navigate, increaseAnonPostLimit]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.left}>
          <h2>Payment for 10 Anonymous Posts</h2>
          <p><strong>User:</strong> {user?.username || 'Loading...'}</p>
          <p><strong>Email:</strong> {user?.email || 'Loading...'}</p>
          <p><strong>Amount:</strong> ₹80</p>
          <p>Please scan the QR to complete the payment.</p>
        </div>
        <div style={styles.right}>
          <img src={qrCode} alt="QR Code" style={styles.qr} />
        </div>
      </div>
      <p style={styles.note}>You will be redirected to the Post Page in 20 seconds...</p>
      <p>
        Current Anon Post Limit:{' '}
        {user?.anonPostLimit !== undefined ? user.anonPostLimit : 'Loading...'}
      </p>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    display: 'flex',
    border: '1px solid #ccc',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '2rem',
    width: '80%',
    maxWidth: '800px',
    justifyContent: 'space-between'
  },
  left: {
    flex: 1,
    paddingRight: '2rem'
  },
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  qr: {
    height: '200px',
    width: '200px'
  },
  note: {
    marginTop: '1rem',
    color: 'gray',
    fontSize: '0.9rem'
  }
};

export default PlanTen;
