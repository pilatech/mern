import { Link } from 'react-router-dom'
// import { useContext } from 'react'
// import { Context } from '../context/ClientData'
function ImagePreview({ src, showCamera }) {
    // const [ updateClientData ] = useContext(Context)
    // updateClientData({image: src})
    return (
     <div className="image-preview">
         <img src={src} alt="preview of the prescription shot" className="gamePreviewImage"/>
         <button className="btn btn-retake" onClick={showCamera}>Retake</button>
         <Link 
            to="/register" 
            state={{ image: src }} 
            className="btn btn-proceed"
            >Proceed</Link>
     </div>
    );
  }
  
  export default ImagePreview;