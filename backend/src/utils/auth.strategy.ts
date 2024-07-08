import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import * as bcrypt from "bcrypt"
import { UserModel as User } from "../Models/user.model";
import * as dotenv from "dotenv";
import { Request } from "express";

dotenv.config();

// passport local strategy
passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: "Incorrect email." });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: "Incorrect password." });
    }
    return done(null, user);
  } catch (error) {
    console.error(error);
    return done(error);
  }
}));

const opts = {
  secretOrKey: process.env.JWT_SECRET || '',
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req: Request) => {
     
      const { jwt } = req.session as any
      return jwt;
    },
  ]),
};

// passport JwtStrategy
passport.use(new JwtStrategy(opts, async (payload: any, done: any) => {
  try {
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false, { message: "User not found." });
    }
    return done(null, user);
  } catch (error) {
    console.error(error);
    return done(error);
  }
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "http://localhost:3001/auth/google/callback"
},
async (token, tokenSecret, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails? profile.emails[0].value : '',
        isAdmin: false,
        wallet: 0
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));


//serialize user
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

//deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    console.error(error);
    done(error);
  }
});

export default passport;