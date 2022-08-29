import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export function join(req, res) {
  return res.render("join", { pageTitle: "JOIN" });
}

export function getEdit(req, res) {
  return res.render("edit-profile", { pageTitle: "EDIT" });
}

export async function postEdit(req, res) {
  const {
    session: {
      user: { _id, email: sessionEmail, username: sessionUsername, avatarUrl },
    },
    body: { email, username, name, location },
    file,
  } = req;
  console.log(req.session.user);
  let change = [];
  if (sessionEmail !== email) {
    change.push({ email });
  }
  if (sessionUsername !== username) {
    change.push({ username });
  }
  if (change.length > 0) {
    const foundUser = await User.findOne({ $or: change });
    if (foundUser && foundUser._id.toString() !== _id) {
      return res.status(400).render("edit-profile", {
        pageTitle: "EDIT",
        errorMessage: "This username/email is already taken.",
      });
    }
  }
  const userUpdate = await User.findByIdAndUpdate(
    _id,
    {
      //유저가 이미지를 변경하지 않는다면, 어떻게 될까?
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = userUpdate;
  return res.redirect("/users/edit");
}

export function login(req, res) {
  return res.render("login", { pageTitle: "Login" });
}

export async function postLogin(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
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
  req.flash("info", "Bye Bye😸");
  req.session.destroy();
  return res.redirect("/");
}

export async function profile(req, res) {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user) {
    return res.status(404).render("404", { pageTitle: "NOT FOUND" });
  }
  return res.render("profile", {
    pageTitle: `${user.name} Profile`,
    user,
  });
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
        socialOnly: true,
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

export async function kakaoLoginStart(req, res) {
  const baseURL = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_CLIENT,
    redirect_uri: process.env.KAKAO_URL,
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();
  const finalURL = `${baseURL}?${params}`;
  return res.redirect(finalURL);
}

export async function kakaoLoginFinish(req, res) {
  const baseURL = "https://kauth.kakao.com/oauth/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_CLIENT,
    redirect_uri: process.env.KAKAO_URL,
    code: req.query.code,
    client_secret: process.env.KAKAO_SECRET,
  };
  const params = new URLSearchParams(config).toString();
  const finalURL = `${baseURL}?${params}`;

  const tockenRequest = await (
    await fetch(finalURL, {
      method: "POST",
    })
  ).json();

  if ("access_token" in tockenRequest) {
    const { access_token } = tockenRequest;
    const apiURL = " https://kapi.kakao.com/";
    const userRequest = await (
      await fetch(`${apiURL}v1/user/access_token_info`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const emailRequest = await (
      await fetch(`${apiURL}v2/user/me`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    const kakaoAccount = emailRequest.kakao_account;
    const kakaoProfile = kakaoAccount.profile;
    if (
      kakaoAccount.is_email_valid === false ||
      kakaoAccount.is_email_verified === false
    ) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: kakaoAccount.email });
    if (!user) {
      user = await User.create({
        name: kakaoProfile.nickname,
        socialOnly: true,
        username: kakaoProfile.nickname,
        email: kakaoAccount.email,
        password: "",
        avatarUrl: kakaoProfile.profile_image_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
}

export async function getChangePassword(req, res) {
  return res.render("change-password", { pageTitle: "Change Password" });
}
export async function postChangePassword(req, res) {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordConfiguration },
  } = req;
  if (newPassword !== newPasswordConfiguration) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match configuration",
    });
  }
  const compare = await bcrypt.compare(oldPassword, password);
  if (!compare) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password does is incorrect.",
    });
  }
  const user = await User.findById(_id);
  user.password = newPassword;
  await user.save();
  req.session.user.password = user.password;
  req.session.destroy();
  req.flash("info", "Password Updated!");
  return res.redirect("/login");
}
