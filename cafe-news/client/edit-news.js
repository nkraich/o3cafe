//------------------
//  Data providers
//------------------

Template.editNewsForm.helpers({
  paragraphsWithIndex: function() {
    var newsPost, paragraphs, i;

    newsPost = Session.get('newsPost');
    if (!newsPost) { return [{}]; }

    paragraphs = newsPost.paragraphs;
    for(i = 0; i < paragraphs.length; i++) {
      paragraphs[i].ui = {
        index: i,
        selected: (Session.get('selectedParagraphIndex') === i),
        isPictureUploaded: (paragraphs[i].image && paragraphs[i].image.id),
        showPictureLeft: (paragraphs[i].image && paragraphs[i].image.orientation === 'left'),
        showPictureCenter: (paragraphs[i].image && paragraphs[i].image.orientation === 'center'),
        showPictureRight: (paragraphs[i].image && paragraphs[i].image.orientation === 'right'),
        noPicture: (!paragraphs[i].image || (
          paragraphs[i].image.orientation !== 'left' &&
          paragraphs[i].image.orientation !== 'center' &&
          paragraphs[i].image.orientation !== 'right'
        )),
        deletable: (paragraphs.length > 1)
      }
    }
    return paragraphs;
  }
});

//-----------
//  Helpers
//-----------

Template.editNews.helpers({
  isNew: function() {
    return Template.currentData() === null;
  }
});

Template.editNewsForm.helpers({
  isNew: function() {
    return Template.currentData() === null;
  },

  title: function() {
    var newsPost = Session.get('newsPost');
    return newsPost ? newsPost.title : "";
  }
});

Template.editNewsParagraph.helpers({
  mediaFileUrl: function(mediaFileId) {
    return CafeCore.getMediaFileUrl(mediaFileId);
  }
});

//----------
//  Events
//----------

Template.editNews.onRendered(function () {
  var newsPost = Template.currentData();

  if (!newsPost) {
    newsPost = { title: "", paragraphs: [{text:"", image: null}] };
  }

  Session.set('newsPost', newsPost);
});

Template.editNewsForm.events = {
  'keyup .title-input': function(event, template) {
    var newsPost;
    newsPost = Session.get('newsPost');
    newsPost.title = $(event.currentTarget).val();
    Session.set('newsPost', newsPost);
  },

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
    var index, newsPost, paragraphs;
    index = parseInt($(event.currentTarget).attr('data-index'));
    newsPost = Session.get('newsPost');
    paragraphs = newsPost.paragraphs;

    paragraphs[index].text = $(event.currentTarget).children('textarea').val();
    Session.set('newsPost', newsPost);
  },

  'click .deleteParagraphButton': function(event, template) {
    var newsPost, paragraphs, paragraph, index;
    newsPost = Session.get('newsPost');
    paragraphs = newsPost.paragraphs;
    paragraph = $(event.currentTarget).parents('.paragraph');
    index = parseInt($(paragraph).attr('data-index'));

    paragraphs.splice(index, 1);

    Session.set('selectedParagraphIndex', -1);
    if (index < paragraphs.length) {
      Session.set('selectedParagraphIndex', index);
      _focusOnParagraph(index);
    }
    else if (index > 0) {
      Session.set('selectedParagraphIndex', index-1);
      _focusOnParagraph(index-1);
    }

    Session.set('newsPost', newsPost);
    event.stopPropagation();
  },

  'click .insertParagraphButton': function(event, template) {
    var newsPost, paragraphs, paragraph, index;
    newsPost = Session.get('newsPost');
    paragraphs = newsPost.paragraphs;
    paragraph = $(event.currentTarget).parents('.paragraph');
    index = parseInt($(paragraph).attr('data-index'));

    paragraphs.splice(index+1, 0, {text: '', image: null});
    Session.set('selectedParagraphIndex', index+1);
    _focusOnParagraph(index+1);

    Session.set('newsPost', newsPost);
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
    var newsPost = Session.get('newsPost');

    event.preventDefault();

    // Trim and validate.
    if (newsPost.title) { newsPost.title = newsPost.title.trim(); }
    if (!newsPost.title || newsPost.title === '') {
      Notifications.showError("You must provide a title.");
      return;
    }

    // Additional fields
    newsPost.userId = Meteor.userId();
    newsPost.createdAt = Date.now();

    // Disable the post button.
    //$('.post-button').prop("disabled", true);
    //template.find('.post-button').

    NewsPosts.insert(
      newsPost,
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

  'click .save-button': function(event, template) {
    var newsPost = Session.get('newsPost');

    event.preventDefault();

    // Trim and validate.
    if (newsPost.title) { newsPost.title = newsPost.title.trim(); }
    if (!newsPost.title || newsPost.title === '') {
      Notifications.showError("You must provide a title.");
      return;
    }

    // Disable the save button.
    //$('.save-button').prop("disabled", true);
    //template.find('.save-button').

    NewsPosts.update(
      {_id: newsPost._id},
      {$set: {
          title: newsPost.title,
          paragraphs: newsPost.paragraphs
        }
      },
      function(error)
      {
        if (error) {
          Notifications.showError(error);
        }
        else {
          Router.go('/news');
        }
        //$('.save-button').prop("disabled", false);
      }
    );
  },

  'click .cancel-button': function(event, template) {
    Router.go('/news');
  }
};

//-----------
//  Private
//-----------

_focusOnParagraph = function(index) {
  Meteor.setTimeout(function() {
    $('.paragraph').slice(index, index+1).find('textarea').focus();
  }, 100);
};

_setParagraphImageId = function(index, id) {
  var newsPost, paragraphs;
  newsPost = Session.get('newsPost');
  paragraphs = newsPost.paragraphs;

  if (!paragraphs[index].image) {
    paragraphs[index].image = {};
  }

  paragraphs[index].image.id = id;

  Session.set('newsPost', newsPost);
};

_setParagraphImageOrientation = function(index, orientation) {
  var newsPost, paragraphs;
  newsPost = Session.get('newsPost');
  paragraphs = newsPost.paragraphs;

  if (!paragraphs[index].image) {
    paragraphs[index].image = {};
  }

  if (paragraphs[index].image.orientation === orientation) {
    paragraphs[index].image.orientation = null;
  }
  else {
    paragraphs[index].image.orientation = orientation;
  }

  Session.set('newsPost', newsPost);
};
