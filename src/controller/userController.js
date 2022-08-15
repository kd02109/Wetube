import User from "../models/User";
import bcrypt from "bcrypt";

export function join(req, res) {
  return res.render("join", { pageTitle: "JOIN" });
}

export function remove(req, res) {
  return res.send("Delet ID");
}

export function edit(req, res) {
  return res.send("Edit User");
}

export function login(req, res) {
  return res.render("login", { pageTitle: "Login" });
}

export async function postLogin(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const pageTitle = "Login";

  if (!user.username) {
    return res.status(404).render("login", {
      pageTitle,
      errorMassage: "We cna't find username",
    });
  }

  const compare = await bcrypt.compare(password, user.password);
  if (!compare) {
    return res.status(404).render("login", {
      pageTitle,
      errorMassage: "Wrong Password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
}

export function logout(req, res) {
  return res.send("Logout");
}

export function profile(req, res) {
  return res.send("See user");
}

export async function uploadJoin(req, res) {
  const { email, username, password1, password2, name, location } = req.body;
  const duplicate = await User.exists({ $or: [{ username }, { email }] });
  const pageTitle = "join";
  if (password1 !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMassage: "The password dosen't correct with confirmation",
    });
  }
  if (duplicate) {
    return res.status(400).render("join", {
      pageTitle,
      errorMassage: "This username/email is already taken",
    });
  } else {
    try {
      await User.create({
        email,
        username,
        password: password1,
        name,
        location,
      });
      return res.redirect("/login");
    } catch (error) {
      console.log(error);
      return res.status(404).render("join", {
        pageTitle,
        errorMassage: error._message,
      });
    }
  }
}
