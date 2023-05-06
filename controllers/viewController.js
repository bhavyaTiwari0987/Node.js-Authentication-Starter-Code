const catchAsync = require('../utils/catchAsync');

// exports.getOverview = catchAsync (async (req, res , next) => {
//   // 1) Get tour data from collection
//   const tours = await Tour.find();
//   // res.cookie('user' , 'Om');

//   // 2) Build template

//   // 3) Render that tmeplate using tour data from 1)
//     res.status(200).render('overview2', {
//       title: 'All Tours',
//       tours
//     });
//   })

//   exports.getTour = catchAsync (async(req, res, next) => {
//     // 1) get the data for the request the tour (including reviews and tour guides)
//     const tour = await Tour.findOne({slug: req.params.slug}).populate({
//       path: 'reviews',
//       fields: 'review rating user'
//     });
       
//     // 2) Build template

//     // 3) Render template using the data from step 1 
//     res.status(200).render('tour2', {
//       title: `${tour.name} Tour`,
//       tour,
//     });
//   });

  exports.getLoginForm = catchAsync(async (req , res, next) => {
    const messages = {
      success: req.flash('success'),
      error: req.flash('error')
    };
    console.log('in the view controller');
    res.render('login' , {
      title: 'Log into your account',
      messages,
    })
  })

  exports.getSignupForm = catchAsync(async (req , res, next) => {
    const messages = {
      success: req.flash('success'),
      error: req.flash('error')
    };
       res.status(200).render('signup' , {
      title: 'SignUp',
      messages,
    })
  })
  exports.getHomePage = catchAsync(async (req , res, next) => {
    res.status(200).render('home' , {
      title: 'Home Page'
    })
  })
  exports.getAboutPage = catchAsync(async (req , res, next) => {
    res.status(200).render('about' , {
      title: 'About Page'
    })
  })
  exports.getProfilePage = catchAsync(async (req , res, next) => {
    const messages = {
      success: req.flash('success'),
      error: req.flash('error'),
      name: req.flash('name')
    };
    res.status(200).render('profile' , {
      title: 'Profile Page',
      messages,
    })
  })