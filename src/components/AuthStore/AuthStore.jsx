import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isLoggedIn: false,
  userId: null,
  username: '',
  userEmail: '',
  
  checkSession: async () => {
    try {
      const response = await fetch('https://travdoodle-api.onrender.com/check_session');
      if (response.ok) {
        const user = await response.json();
        set({ isLoggedIn: true, userId: user.id, username: user.username, userEmail: user.email });
      } else {
        set({ isLoggedIn: false, userId: null, username: '', userEmail: '' });
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  },

  login: async (credentials, navigate) => {
    try {
        const response = await fetch('https://travdoodle-api.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier: credentials.email,  // Change email to identifier
                password: credentials.password,
            }),
        });
        

      if (response.ok) {
        const user = await response.json();
        set({ isLoggedIn: true, userId: user.id, username: user.username, userEmail: user.email });
        navigate('/dashboard'); // Redirect to dashboard after login
      } else {
        const data = await response.json();
        if (response.status === 404) {
          console.error(data.error);
          alert('Email not found');
        } else if (response.status === 401) {
          console.error(data.error);
          alert('Invalid password');
        } else {
          console.error(data.message);
          alert('An error occurred. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error occurred:', error);
      alert('An error occurred. Please try again later.');
    }
  },

  logout: async (navigate) => {
    try {
      const response = await fetch('https://travdoodle-api.onrender.com/logout', {
        method: 'DELETE',
      });

      if (response.ok) {
        set({ isLoggedIn: false, userId: null, username: '', userEmail: '' });
        navigate('/'); // Redirect to home after logout
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },

  deleteAccount: async (userId, handleLogout) => {
    try {
      const response = await fetch(`https://travdoodle-api.onrender.com/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        handleLogout();
      } else {
        console.error('Delete account failed');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  },
}));

export default useAuthStore;
