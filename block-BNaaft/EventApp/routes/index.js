var express = require('express');
var router = express.Router();

const EventForm = require('../Models/EventForm');
const Review = require('../Models/Review');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/home', (req, res) => {
  EventForm.find({}, (err, result) => {
    if (err) console.log(err);
    res.render('index.ejs', { result });
  })
});

router.get('/home/date', (req, res) => {
  console.log(req.query);
  var date = req.query.Date;
  var category = req.query.Category;
  var location = req.query.Location;


  if (date === 'Newest-first' && category === "" && location === "") {
    EventForm.find().sort({ startDate: -1 }).exec((err, result) => {
      res.render('index.ejs', { result });
    });
  }

  else if (date === 'Newest-first' && category !== "" && location === "") {
    EventForm.find({ Category: category }).sort({ startDate: -1 }).exec((err, result) => {
      res.render('index.ejs', { result });
    });
  }

  else if (date === 'Newest-first' && category === "" && location !== "") {
    EventForm.find({ Location: location }).sort({ startDate: -1 }).exec((err, result) => {
      res.render('index.ejs', { result });
    });
  }

  else if (date === 'Oldest-first' && category === "" && location === "") {
    EventForm.find().sort({ startDate: 1 }).exec((err, result) => {
      res.render('index.ejs', { result });
    });
  }

  else if (date === 'Oldest-first' && category !== "" && location === "") {
    EventForm.find({ Category: category }).sort({ startDate: 1 }).exec((err, result) => {
      res.render('index.ejs', { result });
    });
  }

  else if (date === 'Oldest-first' && category === "" && location !== "") {
    EventForm.find({ Location: location }).sort({ startDate: 1 }).exec((err, result) => {
      res.render('index.ejs', { result });
    });
  }

  else if (date === "" && category === "" && location !== "") {
    EventForm.find({ Location: location }).exec((err, result) => {
      res.render('index.ejs', { result });
    });
  }

  else if (date === "" && category !== "" && location === "") {
    EventForm.find({ Location: location }).exec((err, result) => {
      res.render('index.ejs', { result });
    });
  }

  else if (date === "" && category !== "" && location !== "") {
    EventForm.find({ $and: [{ Location: location }, { Category: category }] }).exec((err, result) => {
      res.render('index.ejs', { result });
    });
  }
  else if (date === "" && category === "" && location === "") {
    EventForm.find({}).exec((err, result) => {
      res.render('index.ejs', { result });
    });
  }





});




router.get('/add', (req, res) => {
  res.render('add.ejs');
})

router.post('/add', (req, res) => {
  EventForm.create(req.body, (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.redirect("/home");
  });
});


// router.get('/EventDetails/:id', (req, res) => {
//   var id = req.params.id;

//   EventForm.findById(id, (err, result) => {
//     if (err) console.log(err);
//     Review.find({EventId:id},(err,resultn)=>
//     {
//       console.log(resultn);
//       res.render('EventDetails.ejs', {result,resultn});

//     })

//   })
// });

router.get('/EventDetails/:id', (req, res) => {
  var id = req.params.id;

  EventForm.findById(id).populate('Reviews').exec((err, result) => {
    if (err) console.log(err);
    res.render('EventDetails.ejs', { result });
  })
});


router.get('/:id/edit', (req, res) => {
  var id = req.params.id;
  console.log(id);
  EventForm.findById(id, req.body, (err, result) => {
    if (err) console.log(err);

    res.render('EventEdit.ejs', { result });
  })
});

router.post('/:id/edit', (req, res) => {
  var id = req.params.id;

  EventForm.findByIdAndUpdate(id, req.body, { new: true }, (err, result) => {
    if (err) console.log(err);
    res.redirect('/EventDetails/' + id);
  })
});


// router.get('/:id/delete', (req, res) => {
//   var id = req.params.id;

//   EventForm.findByIdAndDelete(id, req.body, (err, result) => {
//     if (err) console.log(err);
//     res.redirect('/home');

//   })
// })

router.get('/:id/delete', (req, res) => {
  var id = req.params.id;

  EventForm.findByIdAndDelete(id, req.body, (err, result) => {
    if (err) console.log(err);

    Review.deleteMany({ EventId: result.id }, (err, success) => {
      res.redirect('/home');
    });
  })
})


// router.post('/:id/Review', (req, res) => {
//   var id = req.params.id;
//   req.body.EventId = id;

//   Review.create(req.body, (err, result) => {
//     if(err) console.log(err);
//     console.log(result);
//     res.redirect('/EventDetails/' + id);
//     });
// });

router.post('/:id/Review', (req, res) => {
  var id = req.params.id;
  req.body.EventId = id;

  Review.create(req.body, (err, success) => {
    if (err) console.log(err);

    EventForm.findByIdAndUpdate(id, { $push: { Reviews: success._id } }, (err, result) => {
      if (err) console.log(err);
      res.redirect('/EventDetails/' + id);
    });

  })
})


router.get('/:id/Review/edit', (req, res) => {
  var id = req.params.id;
  Review.findById(id, req.body, (err, result) => {
    console.log(result);
    console.log(result.id);
    res.render('ReviewEdit', { result: result })
  })
})

router.post('/:id/Review/edit', (req, res) => {
  var id = req.params.id;
  Review.findByIdAndUpdate(id, req.body, (err, result) => {
    res.redirect('/EventDetails/' + result.EventId);
  })
});


// router.get('/:id/Review/delete', (req, res) => {
//   {
//     var id = req.params.id;
//     Review.findByIdAndDelete(id, req.body, (err, result) => {
//       if (err) console.log(err);
//              res.redirect('/EventDetails/' + result.EventId);
//       })
//       }
// });

router.get('/:id/Review/delete', (req, res) => {
  {
    var id = req.params.id;
    Review.findByIdAndDelete(id, req.body, (err, success) => {
      if (err) console.log(err);
      console.log(success);
      EventForm.findByIdAndUpdate(success.EventId, { $pull: { Reviews: success._id } }, (err, result) => {
        if (err) console.log(err);
        console.log("Reviews deleted from reference aswell")
        res.redirect('/EventDetails/' + success.EventId);
      })
    })
  }
});


router.get('/:id/Likes', (req, res) => {
  var id = req.params.id;
  EventForm.findByIdAndUpdate(id, { $inc: { Likes: 1 } }, (err, success) => {
    if (err) console.log(err);
    res.redirect('/EventDetails/' + id);
  })
});







module.exports = router;
