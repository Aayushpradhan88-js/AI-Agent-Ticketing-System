import React , {useState}from 'react';
import { Link } from 'react-router-dom';

export const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



  return (
    <div className=''>
        <div>
            {/* Top DESIGN */}
            <div>
                <h3>Logo</h3>

                SignIn Account

            </div>

            {/* Bottom DESIGN */}
            <div>
                <form action="">

                    <div>
                        <label htmlFor="">Email</label>
                        <input 
                        type="text"
                         placeholder='email'
                         value={email}
                         onChange={(e) => setEmail(e.target.value)} 
                         className='w-full' />

                    </div>
                    <div>
                        <label htmlFor="">Password</label>
                        <input 
                        type="text"
                         placeholder='password'
                         value={password}
                         onChange={e => setPassword(e.target.value)} 
                         className='w-full' />

                    </div>
                    <button>Signin</button>


                    <p className='cursor-pointer'>Create Account? <Link to='/signup-account'>SignUp</Link>
                    </p>

                    <p>SignIn in with Google</p>

                    <button>Google G</button>
                </form>
            </div>
        </div>
    </div>
  )
}