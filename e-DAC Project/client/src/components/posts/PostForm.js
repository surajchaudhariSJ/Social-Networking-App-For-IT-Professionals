import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';

const PostForm = ({ addPost }) => {
    const [text, setText] = useState('');

    return (
        <div class="post-form">
        
        <form class="form my-1" onSubmit={e => {
            e.preventDefault();
            addPost({ text });
            setText('');
        }}>
          <textarea
            name="text"
            cols="50"
            rows="5"
            placeholder="Add text here to create new post"
            value={text}
            onChange={e => setText(e.target.value)}
            required
          ></textarea>
          <input type="submit" class="btn btn-primary my-1" value="Submit" />
        </form>
      </div>
    )
}

PostForm.propTypes = {
    addPost: PropTypes.func.isRequired
}

export default connect(null, { addPost })(PostForm);
