window.ui = {
  state: 'loading',
  readyToCollect: false,
  nExamples: 0,
  nTrainings: 0,

  setContent: function(key, value) {
    // Set an element's content based on the data-content key.
    $('[data-content="' + key + '"]').html(value);
  },

  showInfo: function(text, dontFlash) {
    // Show info and beep / flash.
    this.setContent('info', text);
    if (!dontFlash) {
      $('#info').addClass('flash');
      new Audio('hint.mp3').play();
      setTimeout(function() {
        $('#info').removeClass('flash');
      }, 1000);
    }
  },

  onWebcamEnabled: function() {
    this.state = 'finding face';
    this.showInfo("Stay in a clear area to find face", true);
  },

  onFoundFace: function() {
    if (this.state == 'finding face') {
      this.state = 'collecting';
      this.readyToCollect = true;
      this.showInfo(
        "<h3>Let's begin</h3>" +
          'Move your eyes on all four directions by moving your mouse and by clicking space button, this will help the model to get enough data',
        true,
      );
    }
  },

  onAddExample: function(nTrain, nVal) {
    // Call this when an example is added.
    this.nExamples = nTrain + nVal;
    this.setContent('n-train', nTrain);
    this.setContent('n-val', nVal);
    if (nTrain >= 2) {
      $('#start-training').prop('disabled', false);
    }
    if (this.state == 'collecting' && this.nExamples == 5) {
      this.showInfo(
        '<h3>Awesome work!</h3>' +
          'We need atleast 20 data for the better results',
      );
    }
    if (this.state == 'collecting' && this.nExamples == 25) {
      this.showInfo(
        '<h3>Great!</h3>' +
          "Now let's train the model<br> " +
          'Click the training button in the top right corner!',
      );
    }
    if (this.state == 'trained' && this.nExamples == 50) {
      this.showInfo(
        '<h3>Almost there</h3>' +
          "You've collected lots of examples. Let's try training again!",
      );
    }
    if (nTrain > 0 && nVal > 0) {
      $('#store-data').prop('disabled', false);
    }
  },

  onFinishTraining: function() {
    // Call this when training is finished.
    this.nTrainings += 1;
    $('#target').css('opacity', '0.9');
    $('#draw-heatmap').prop('disabled', false);
    $('#reset-model').prop('disabled', false);
    $('#store-model').prop('disabled', false);

    if (this.nTrainings == 1) {
      this.state = 'trained';
      this.showInfo(
        '<h3>Good job!</h3>' +
          'The green target should start following your eyes around.<br>' +
          "Let's collect more training data for better accuracy, keep training again!",
      );
    } else if (this.nTrainings == 2) {
      this.state = 'trained_twice';
      this.showInfo(
        '<h3>Getting better!</h3>' +
          'Keep collecting and retraining!<br>' +
          'You can also draw a heatmap that shows you where your ' +
          'model has its strong and weak points.',
      );
    } else if (this.nTrainings == 3) {
      this.state = 'trained_thrice';
      this.showInfo(
        'If your model is overfitting, you can reset the model anytime',
      );
    } else if (this.nTrainings == 4) {
      this.state = 'trained_thrice';
      this.showInfo(
        '<h3>Have fun!</h3>',
      );
    }
  },
};
