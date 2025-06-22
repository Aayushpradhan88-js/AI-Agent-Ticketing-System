import React , {useState}from 'react'
import { Link } from 'react-router-dom';

export const SignUp = () => {
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');



  return (
    <div className=''>
        <div>
            {/* Top DESIGN */}
            <div>
                <h3>Logo</h3>

                Signup Account

            </div>

            {/* Bottom DESIGN */}
            <div>
                <form action="">
                    <div>
                         <label htmlFor="">Username</label>
                        <input 
                        type="text" 
                        placeholder='Username' 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    <div>
                        <label htmlFor="">Fullname</label>
                        <input 
                        type="text"
                         placeholder='fullname'
                         value={fullname}
                         onChange={(e) => setFullname(e.target.value)} 
                         className='w-full' />

                    </div>

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

                    <div>
                        <label htmlFor="">Profile picture</label>
                        <input
                         type='upload'
                         placeholder='upload image'
                            value={profilePicture}
                            onChange={e => setProfilePicture(e.target.value)}
                            className='w-full'
                        />
                    </div>
                    <button>Signin</button>

                    <p className='pointer-cursor'> Already have a account? <Link to='/signin-account'>SignIn</Link></p>

                    <p>Sin in with Google</p>

                    <button>Google G</button>
                </form>
            </div>
        </div>
    </div>
  )
}