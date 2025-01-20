import { Alert, Button, Label, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/cropped-Paradox-lgo-01-1-1.png'
import { useDispatch,useSelector } from 'react-redux';
import { signInStart,signInSuccess,signInFailure } from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  // const [errorMessage, setErrorMessage] = useState(null);
  const {error:errorMessage} = useSelector(state => state.user);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();//prewent defauld behavior of form (refresing)
    if (!formData.email || !formData.password) {
      // return setErrorMessage('Please fill out all fields.');
      dispatch(signInFailure('Please fill out all fields.'));
    }

    try {
      // setErrorMessage(null);
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        // return setErrorMessage(data.message);
        dispatch(signInFailure(data.message));
      }
      if(res.ok) {
        dispatch(signInSuccess(data))
        navigate('/');

      }
    } catch (error) {
      // setErrorMessage(error.message);
      dispatch(signInFailure(error.message));
      
    }
  };
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to='/' className='self-center'>
            <img className="logo h-12 max-w-2xl" src={logo}></img>
          </Link>
          <p className='text-sm mt-5'>
            This is a Policy awareness platform in Paradox. You can sign up with your company email and password
            or with Google.
          </p>
        </div>
        {/* right */}

        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your email' />
              <TextInput
                type='email'
                placeholder='name@company.com'
                id='email'
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Your password' />
              <TextInput
                type='password'
                placeholder='Password'
                id='password'
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit'>
                Sign In
            </Button>
            
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span> Don't have an account? </span>
            <Link to='/sign-up' className='text-blue-500'>
              Sign Up
            </Link>
          </div>
          {/* show alert */}
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
