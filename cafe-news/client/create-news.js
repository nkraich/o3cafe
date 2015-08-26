var _paragraphs = [
      {text: "Test paragraph text 1.", image: null},
      {text: "Test paragraph text 2.", image: {orientation: 'left'}},
      {text: "Test paragraph text 3.", image: {orientation: 'center'}},
      {text: "Test paragraph text 4.", image: null}
    ];

_focusOnParagraph = function(index) {
  Meteor.setTimeout(function() {
    $('.paragraph').slice(index, index+1).find('textarea').focus();
  }, 100);
};

_setParagraphImageId = function(index, id) {
  if (!_paragraphs[index].image) {
    _paragraphs[index].image = {};
  }

  _paragraphs[index].image.id = id;
};

_setParagraphImageOrientation = function(index, orientation) {
  if (!_paragraphs[index].image) {
    _paragraphs[index].image = {};
  }

  if (_paragraphs[index].image.orientation === orientation) {
    _paragraphs[index].image.orientation = null;
  }
  else {
    _paragraphs[index].image.orientation = orientation;
  }
};

Template.createNewsForm.helpers({
  paragraphs: function() {
    /*var post = NewsPosts.findOne({}, {
      sort: {"createdAt": -1},
      limit: 25 
    });
    return (post && post.paragraphs) ? post.paragraphs : [];*/
  },

  paragraphsWithIndex: function(array) {
    var i;

    for(i = 0; i < _paragraphs.length; i++) {
      _paragraphs[i].ui = {
        index: i,
        selected: (Session.get('selectedParagraphIndex') === i),
        isPictureUploaded: (_paragraphs[i].image && _paragraphs[i].image.id),
        showPictureLeft: (_paragraphs[i].image && _paragraphs[i].image.orientation === 'left'),
        showPictureCenter: (_paragraphs[i].image && _paragraphs[i].image.orientation === 'center'),
        showPictureRight: (_paragraphs[i].image && _paragraphs[i].image.orientation === 'right'),
        noPicture: (!_paragraphs[i].image || (
          _paragraphs[i].image.orientation !== 'left' &&
          _paragraphs[i].image.orientation !== 'center' &&
          _paragraphs[i].image.orientation !== 'right'
        )),
        deletable: (_paragraphs.length > 1)
      }
    }
    return _paragraphs;
  }
});

Template.createNewsParagraph.helpers({
  mediaFileUrl: function(mediaFileId) {
    return CafeCore.getMediaFileUrl(mediaFileId);
  }
});

Template.createNewsParagraph.rendered = function() {
  //alert($('.paragraph').length);
};

Template.createNewsForm.events = {
  'focus .paragraph textarea': function(event, template) {
    var paragraph, index;
    paragraph = $(event.currentTarget).parents('.paragraph');
    index = parseInt($(paragraph).attr('data-index'));

    Session.set('selectedParagraphIndex', index);
  },

  'click .paragraph': function(event, template) {
    var paragraph, index;
    paragraph = $(event.currentTarget);
    index = parseInt($(paragraph).attr('data-index'));

    Session.set('selectedParagraphIndex', index);
  },

  'keyup .paragraph': function(event, template) {
    var index = parseInt($(event.currentTarget).attr('data-index'));
    _paragraphs[index].text = $(event.currentTarget).children('textarea').val();
  },

  'click .deleteParagraphButton': function(event, template) {
    var paragraph, index;
    paragraph = $(event.currentTarget).parents('.paragraph');
    index = parseInt($(paragraph).attr('data-index'));

    _paragraphs.splice(index, 1);

    Session.set('selectedParagraphIndex', -1);
    if (index < _paragraphs.length) {
      Session.set('selectedParagraphIndex', index);
      _focusOnParagraph(index);
    }
    else if (index > 0) {
      Session.set('selectedParagraphIndex', index-1);
      _focusOnParagraph(index-1);
    }

    event.stopPropagation();
  },

  'click .insertParagraphButton': function(event, template) {
    var paragraph, index;
    paragraph = $(event.currentTarget).parents('.paragraph');
    index = parseInt($(paragraph).attr('data-index'));

    _paragraphs.splice(index+1, 0, {text: '', image: null});
    Session.set('selectedParagraphIndex', index+1);
    _focusOnParagraph(index+1);

    event.stopPropagation();
  },

  'click .showPictureLeftButton': function(event, template) {
    var paragraph, index;
    paragraph = $(event.currentTarget).parents('.paragraph');
    index = parseInt($(paragraph).attr('data-index'));

    _setParagraphImageOrientation(index, 'left');
    Session.set('selectedParagraphIndex', -1);
    Session.set('selectedParagraphIndex', index);

    event.stopPropagation();
  },

  'click .showPictureCenterButton': function(event, template) {
    var paragraph, index;
    paragraph = $(event.currentTarget).parents('.paragraph');
    index = parseInt($(paragraph).attr('data-index'));

    _setParagraphImageOrientation(index, 'center');
    Session.set('selectedParagraphIndex', -1);
    Session.set('selectedParagraphIndex', index);

    event.stopPropagation();
  },

  'click .showPictureRightButton': function(event, template) {
    var paragraph, index;
    paragraph = $(event.currentTarget).parents('.paragraph');
    index = parseInt($(paragraph).attr('data-index'));

    _setParagraphImageOrientation(index, 'right');
    Session.set('selectedParagraphIndex', -1);
    Session.set('selectedParagraphIndex', index);

    event.stopPropagation();
  },

  'change .file-input': function(event, template) {
    var paragraph, index;
    paragraph = $(event.currentTarget).parents('.paragraph');
    index = parseInt($(paragraph).attr('data-index'));

    CafeCore.uploadMediaFileFromFileSelectorEvent(event, function(mediaFile) {
      console.log(mediaFile._id);
      _setParagraphImageId(index, mediaFile._id);

      Session.set('selectedParagraphIndex', -1);
      Session.set('selectedParagraphIndex', index);
    });
  },

  'click .post-button': function(event, template) {
    var title;

    event.preventDefault();

    // Set values.
    title = template.find('#titleInput').value;

    // Trim.
    if (title) { title = title.trim(); }

    // Required fields
    if (!title || title === '') {
      Notifications.showError("You must provide a title.");
      return;
    }

    // Disable the post button.
    //$('.post-button').prop("disabled", true);
    //template.find('.post-button').

    NewsPosts.insert(
      {
        userId: Meteor.userId(),
        createdAt: Date.now(),
        title: title
      },
      function(error)
      {
        if (error) {
          Notifications.showError(error);
        }
        else {
          Router.go('/news');
        }
        //$('.post-button').prop("disabled", false);
      }
    );
  },

  'click .cancel-button': function(event, template) {
    Router.go('/news');
  }
};
