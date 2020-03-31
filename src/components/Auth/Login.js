import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase/firebase.utils';

function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleChangeEmail = e => {
    setEmail(e.target.value);
  };
  const handleChangePassword = e => {
    setPassword(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (email === '' || password === '') {
      return setError('Please fill in all the blanks');
    } else {
      setLoading(true);
      try {
        auth.signInWithEmailAndPassword(email, password);
        setPassword('');
        setEmail('');
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    }
  };
  return (
    <div
      className="d-flex flex-column justify-content-center"
      style={{ height: '100vh' }}
    >
      <div className="row mb-3">
        <div className="col-md-6 mx-auto">
          <div className="d-flex justify-content-center align-items-center mb-2">
            <i className="fas fa-puzzle-piece fa-5x text-success "></i>
          </div>
          <h2 className="text-success text-center">Login for DevChat</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-transparent">
                        <i className="fas fa-envelope"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      name="email"
                      value={email}
                      onChange={handleChangeEmail}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-transparent">
                        <i className="fas fa-key"></i>
                      </span>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={password}
                      onChange={handleChangePassword}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  value="Submit"
                  disabled={loading}
                  className="btn btn btn-success btn-block"
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
              {error.length ? (
                <div className="alert alert-danger mt-3">{error}</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-header py-0">
              <p className="text-center pt-2">
                Dont have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
