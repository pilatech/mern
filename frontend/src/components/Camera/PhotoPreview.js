import React from 'react';
import { Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PhotoPreview({ image, retake }) {
  return (
    <Row>
      <img className="preview-image" src={image} alt="prescription" />
      <div className="image-actions">
        <Link to="/register" state={{ image }} className="btn btn-proceed">
          Proceed
        </Link>
        <button className="btn btn-retake" onClick={retake}>
          Retake
        </button>
      </div>
    </Row>
  );
}

export default PhotoPreview;
