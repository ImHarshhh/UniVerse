import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import qrCode from '../assets/qr-10.jpg';

const PlanOne = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to increase anonymous post limit
  const increaseAnonPostLimit = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/users/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          anonPostLimit: user?.anonPostLimit + 1,
          
        }),
      });

      if (res.ok) {
        setUser((prevUser) => ({
          ...prevUser,
          anonPostLimit: prevUser.anonPostLimit + 1,
        }));
        console.log("Successfully incremented anonPostLimit");
      } else {
        console.error("Failed to update anonPostLimit");
      }
    } catch (error) {
      console.error("Error updating anonPostLimit:", error);
    }
  }, [user?.anonPostLimit]);

  // Fetch user details once on component mount
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
            console.log('User state:', data);
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

  // Start timer once user is loaded
  useEffect(() => {
    if (!user) return;

    console.log('PlanOne component mounted');
    const timer = setTimeout(() => {
      console.log('Timer callback executed');
      increaseAnonPostLimit();
      navigate('/new-post');
    }, 20000); // 20 seconds

    console.log('Timer set for 20 seconds');

    return () => {
      clearTimeout(timer);
      console.log('Timer cleared');
    };
  }, [user, navigate, increaseAnonPostLimit]);


  return (
    <div style={styles.container}>
    <div style={styles.card}>
      <div style={styles.left}>
        <h2>Payment for 1 Anonymous Post</h2>
        <p><strong>User:</strong> {user?.username || 'Loading...'}</p>
        <p><strong>Email:</strong> {user?.email || 'Loading...'}</p>
        <p><strong>Amount:</strong> ₹10</p>
        <p>Please scan the QR to complete the payment.</p>
      </div>
      <div style={styles.right}>
        <img
          src={qrCode}
          alt="QR Code"
          style={styles.qr}
        />
      </div>
    </div>
    <p style={styles.note}>You will be redirected to the Post Page in 20 seconds...</p>
  </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    display: 'flex',
    border: '1px solid #ccc',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '3rem', // Increased padding for more space
    width: '90%', // Increased width for the card
    maxWidth: '900px', // Increased max width for the card
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    paddingRight: '2rem',
  },
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qr: {
    height: '250px', // Increased height for the QR code
    width: '250px', // Increased width for the QR code
  },
  note: {
    marginTop: '1rem',
    color: 'gray',
    fontSize: '0.9rem',
  },
};
export default PlanOne;