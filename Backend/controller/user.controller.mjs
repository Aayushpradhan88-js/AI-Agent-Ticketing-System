// "strict mode";

// import router from "../routes/user.route.mjs";
// import userFields from "../models/user.model.mjs";
// import { validationResult } from "express-validator";
// import bcrypt from "bcrypt";

// router.userRegister(async (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { fullName, email, password } = req.body;
//     const hashpassword = await bcrypt.hash(password, 10);
//     const User = new userFields({
//         fullName,
//         email,
//         password: hashpassword
//     })
// })

// export default router