const { getUser } = require("../service/auth");

async function restrictToLoggedinUseronly(req, res, next) {
    const userUid = req.cookies?.uid;
    console.log(userUid);

    if (!userUid) return res.redirect('https://frost-style.netlify.app/login');

    try {
        const user = await getUser(userUid);

        if (!user) return res.redirect('https://frost-style.netlify.app/login');

        req.user = user;
        next();
    } catch (error) {
        // Handle errors, e.g., log them or redirect to an error page
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    restrictToLoggedinUseronly
};
