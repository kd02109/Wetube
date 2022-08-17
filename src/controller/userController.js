import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export function join(req, res) {
  return res.render("join", { pageTitle: "JOIN" });
}

export function edit(req, res) {
  return res.send("Edit User");
}

export function login(req, res) {
  return res.render("login", { pageTitle: "Login" });
}

export async function postLogin(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username, githubId: false });
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
  req.session.destroy();
  return res.redirect("/");
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

export function startGithubLogin(req, res) {
  const baseURL = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalURL = `${baseURL}?${params}`;
  return res.redirect(finalURL);
}

export async function finishGithubLogin(req, res) {
  const baseURL = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  console.log(config);
  const params = new URLSearchParams(config).toString();
  const finalURL = `${baseURL}?${params}`;
  const tockenRequest = await (
    await fetch(finalURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tockenRequest) {
    const { access_token } = tockenRequest;
    const apiURL = "https://api.github.com/";
    const userRequest = await (
      await fetch(`${apiURL}user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userRequest);
    const emailRequest = await (
      await fetch(`${apiURL}user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailRequest.find(
      (email) => email.primary === true && email.verified === true
    );
    console.log(emailObj);
    if (!emailObj) {
      return res.redirect("/login");
    }
    const existingUser = await User.findOne({ email: emailObj.email });
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      const user = await User.create({
        avatarUrl: userRequest.avatar_url,
        email: emailObj.email,
        username: userRequest.login,
        password: "",
        name: userRequest.name,
        githubId: true,
        location: userRequest.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
}
