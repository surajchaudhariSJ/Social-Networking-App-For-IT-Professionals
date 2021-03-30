import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';


const Navbar = ({ 
  auth: { isAuthenticated, loading }, logout
}) => {
  const authLinks = (
    <ul>
      <li>
        <i className="fas fa-address-card"></i>
        <Link to='/posts'>Posts</Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className="fas fa-user"></i>{' '}
          <span className='hide-sm'>Profile</span>
        </Link>
      </li>
        <li>
          <a onClick={logout} href='#!'>
            <i className="fas fa-sign-out-alt"></i>{' '}
          <span className='hide-sm'>Logout</span>
          </a>
        </li>
      </ul>
  );

  const guestLinks = (
    <ul>
        <li><Link to='/register'>Register</Link></li>
        <li><Link to='/login'>Login</Link></li>
      </ul>
  );

    return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to='/'>
            <i className='fas fa-home'></i> Home
        </Link>
        <Link to='/profiles'>
            <i className="fas fa-users"></i>{' '}
            <span className='hide-sm'>Users</span>
        </Link>
      </h1>
      { !loading && (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>) }
    </nav>
    )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);