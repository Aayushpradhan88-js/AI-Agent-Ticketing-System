import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.models.js";

//----------Google OAuth Strategy----------//
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/v1/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            //----------Check if user already exists with this Google ID----------//
            let existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) return done(null, existingUser);

            //-----Check if user exists with same email-----//
            existingUser = await User.findOne({ email: profile.emails[0].value }); //--REASONING CODE--//

            if (existingUser) {
                //--- Link Google account to existing user---//
                existingUser.googleId = profile.id;
                await existingUser.save();
                return done(null, existingUser);
            }

            //-----Create new user-----//
            const newUser = new User(
                {
                    googleId: profile.id,
                    username: profile.displayName || profile.emails[0].value.split('@')[0],
                    email: profile.emails[0].value,
                    skills: [],
                    role: "user"
                }
            );

            const savedUser = await newUser.save();
            return done(null, savedUser);

        } catch (error) {
            return done(error, null);
        }
    }));

//----------Serialize user for session----------//
passport.serializeUser((user, done) => {
    done(null, user._id);
});

//----------Deserialize user from session----------//
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select("-password");
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;