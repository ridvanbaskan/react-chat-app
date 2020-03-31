import React from 'react';
import { Link } from 'react-router-dom';
import {
  auth,
  createUserProfileDocument,
  firestore
} from '../../firebase/firebase.utils';
import md5 from 'md5';

function Register() {
  const [userName, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleChangeUsername = e => {
    setUsername(e.target.value);
  };
  const handleChangeEmail = e => {
    setEmail(e.target.value);
  };
  const handleChangePassword = e => {
    setPassword(e.target.value);
  };
  const handleChangeConfirmPassword = e => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (
      userName === '' ||
      email === '' ||
      password === '' ||
      confirmPassword === ''
    ) {
      return setError('Please fill in all the blanks');
    } else if (password.length < 6 || confirmPassword.length < 6) {
      return setError('Please enter at least 6 characters...');
    } else if (password !== confirmPassword) {
      return setError('Both passwords should match...');
    } else {
      try {
        setLoading(true);
        const { user } = await auth.createUserWithEmailAndPassword(
          email,
          password
        );

        await user.updateProfile({
          displayName: userName,
          photoURL: `http://gravatar.com/avatar/${md5(user.email)}`
        });
        console.log(user.uid);

        firestore
          .collection('users')
          .doc(user.uid)
          .set({
            name: user.displayName,
            avatar: user.photoURL
          });
        await createUserProfileDocument(user, { userName });
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
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
            <i className="fas fa-puzzle-piece fa-5x text-danger "></i>
          </div>
          <h2 className="text-danger text-center">Register for DevChat</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group has-feedback">
                  <label className="control-label">Username</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-transparent">
                        <i className="fas fa-user"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      name="userName"
                      value={userName}
                      onChange={handleChangeUsername}
                      placeholder="Username"
                    />
                  </div>
                </div>
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
                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-transparent">
                        <i className="fas fa-redo"></i>
                      </span>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChangeConfirmPassword}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  value="Submit"
                  disabled={loading}
                  className="btn btn btn-danger btn-block"
                >
                  {loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    'Submit'
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
                Already a user? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
