// Define study
const study = lab.util.fromObject({
  "title": "root",
  "type": "lab.flow.Sequence",
  "parameters": {},
  "plugins": [
    {
      "type": "lab.plugins.Metadata",
      "path": undefined
    }
  ],
  "metadata": {
    "title": "Primacy-resource-exp2-5items",
    "description": "Separate input and output position, induce binding",
    "repository": "",
    "contributors": ""
  },
  "messageHandlers": {
    "epilogue": function anonymous(
) {
	jatos.endStudyAndRedirect("https://app.prolific.co/submissions/complete?cc=7F5B6EC0", true, "the study was finished");
}
  },
  "files": {},
  "responses": {},
  "content": [
    {
      "type": "lab.html.Screen",
      "files": {},
      "responses": {
        "keydown(Space)": ""
      },
      "parameters": {},
      "messageHandlers": {
        "before:prepare": function anonymous(
) {
class Latin {
  constructor(size = 3) {
    this.size = size;
    this.mst = [...Array(this.size)].map((v, i) => i + 1);
    this.square = Array(this.size).fill(0).map(() => Array(this.size).fill(0));
 
    if (this.create(0, 0)) {
      //console.table(this.square);
    }
  }
 
  create(c, r) {
    const d = [...this.mst];
    let s;
    while (true) {
      do {
        s = d.splice(Math.floor(Math.random() * d.length), 1)[0];
        if (!s) return false;
      } while (this.check(s, c, r));
 
      this.square[c][r] = s;
      if (++c >= this.size) {
        c = 0;
        if (++r >= this.size) {
          return true;
        }
      }
      if (this.create(c, r)) return true;
      if (--c < 0) {
        c = this.size - 1;
        if (--r < 0) {
          return false;
        }
      }
    }
  }
 
  check(d, c, r) {
    for (let a = 0; a < this.size; a++) {
      if (c - a > -1) {
        if (this.square[c - a][r] === d)
          return true;
      }
      if (r - a > -1) {
        if (this.square[c][r - a] === d)
          return true;
      }
    }
    return false;
  }
}

window.funs = {
  draw_text: function(text, center_x, center_y, font_style='30px Arial', fill_style = "rgb(0,0,0)") {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    center_x = center_x + canvas.width*0.5
    center_y = center_y + canvas.height*0.5
    ctx.font = font_style;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = fill_style;
    ctx.fillText(text, center_x, center_y);
  },

  draw_box: function(center_x, center_y, width, height) {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    center_x = center_x + canvas.width*0.5
    center_y = center_y + canvas.height*0.5
    ctx.beginPath();
    ctx.rect(center_x-width/2, center_y-height/2, width, height);
    ctx.stroke();
  },

  draw_box_div: function(id, center_x, center_y, width, height) {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    center_x = center_x + canvas.width*0.5
    center_y = center_y + canvas.height*0.5
    box = document.getElementById('box'+id);
    box.style.left = center_x-width/2 +'px';
    box.style.top = center_y-height/2 + 'px';
    box.style.width = width + 'px';
    box.style.height = height + 'px';
    box.style.border = "2px solid black"
  },

  shuffle_multiple: function() {
    var arrLength = 0;
    var argsLength = arguments.length;
    var rnd, tmp;

    for (var index = 0; index < argsLength; index += 1) {
            if (index === 0) {
        arrLength = arguments[0].length;
      }
    }

    while (arrLength) {
      rnd = Math.floor(Math.random() * arrLength);
      arrLength -= 1;
      for (argsIndex = 0; argsIndex < argsLength; argsIndex += 1) {
        tmp = arguments[argsIndex][arrLength];
        arguments[argsIndex][arrLength] = arguments[argsIndex][rnd];
        arguments[argsIndex][rnd] = tmp;
      }
    }
  },
}


Trial_counter = -1;
Overall_accuracy = [];


window.pars = {
  n_practice: 4,
  n_buffer: 2,
  n_trials: 60,
  stim_time: 750,
  blank_time: 500,
  isi: 250,
  q_time: 1000,
  forget_time: 150,
  forget_isi: 100,
  canvas_width: 1000,
  canvas_height: 750,
  set_size2: 5, // number of items in the second array
  combined_max_setsize: 10,
  box_radius: 200,
  box_size: 65,
}

// generate box locations
let box_angles = [0,36,72,108,144,180,216,252,288,324] //[0,45,90,135,180,225,270,315] 
let box_x = box_angles.map((i) => Math.cos(i*Math.PI/180)*pars.box_radius);
let box_y = box_angles.map((i) => -Math.sin(i*Math.PI/180)*pars.box_radius);
pars.box_xy = []
for (i=0;i<box_angles.length; i++) {
  pars.box_xy.push([box_x[i],box_y[i]])
}

// generate stim sets
let all_words = ['B', 'C', 'D', 'F', 'G', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'S', 'T', 'V', 'X', 'Z']
all_words = this.random.shuffle(all_words);
exp_words = all_words.slice(0,pars.combined_max_setsize) // sample 12 words for this participants

// generate set sizes for part 1
pars.set_size1 = Array(pars.n_trials/5).fill([1,2,3,4,5]).flat();

// determine if first part is tested
pars.trial_type = Array(pars.n_trials/2).fill(['first']).flat();
pars.trial_type.push(Array(pars.n_trials/2).fill(['full']).flat());
pars.trial_type = pars.trial_type.flat();

// shuffle set size and trial_type and add practice and buffer trials
funs.shuffle_multiple(pars.set_size1, pars.trial_type)

for (i=0;i<pars.n_buffer;i++) {
  pars.set_size1.unshift(5);
  pars.trial_type.unshift('first');
}
pars.set_size1.unshift(3,2,4,4);
pars.trial_type.unshift('first','full','first','full');



// select words and locations for each trial
let locations = [0,1,2,3,4,5,6,7,8,9];
let trial_words1 = [];
let trial_words2 = [];
let trial_locations1 = [];
let trial_locations2 = [];
for (i=0; i < pars.set_size1.length; i++) {
  let trial_words = this.random.shuffle(exp_words);
  let trial_set_size = pars.set_size1[i];
  let words1 = [];
  let trial_locs = this.random.shuffle(locations);
  let locs1 = [];
  for (j=0; j < trial_set_size; j++) {
    let word = trial_words.pop();
    let loc = trial_locs.pop();
    words1.push(word);
    locs1.push(loc);
  }
  // select words for the second part in full trials
  let words2 = [];
  let locs2 = [];
  if (pars.trial_type[i] == "full") {
    for (k=0; k<pars.set_size2; k++) {
      let word = trial_words.pop();
      let loc = trial_locs.pop();
      words2.push(word);
      locs2.push(loc);
    }
  }
  trial_words1.push(words1);
  trial_words2.push(words2);
  trial_locations1.push(locs1);
  trial_locations2.push(locs2);
}
pars.trial_words1 = trial_words1;
pars.trial_words2 = trial_words2;
pars.trial_locations1 = trial_locations1;
pars.trial_locations2 = trial_locations2;

// generate test orders via Latin square
let test_order1 = [];
let test_order2 = [];
for (i=0; i < pars.n_trials/8; i++) {
  let order = new Latin(5).square
  for (j=0; j<5; j++) {
    test_order2.push(order[j]);
  }
}
test_order2 = this.random.shuffle(test_order2);
test_order2_full = [];

for (i=0; i < pars.set_size1.length; i++) {
  let current_setsize = pars.set_size1[i];
  let order = new Latin(current_setsize).square[0];
  test_order1.push(order);
  if (pars.trial_type[i] == "full") {
    if (i < 4) {
      test_order2_full.push(this.random.sample(test_order2)[0]);
    } else {
      test_order2_full.push(test_order2.pop());
    }
  } else {
    test_order2_full.push([]);
  }
}

pars.test_order1 = test_order1;
pars.test_order2 = test_order2_full;







}
      },
      "title": "Intro (script)",
      "content": "\u003Cheader\u003E\r\n  \u003Ch1\u003E Welcome to the study!\u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Cstyle\u003E\r\n  #div1{width: 600px;text-align: center;}\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center\"\u003E\r\n  \u003Cdiv id=\"div1\"\u003E\r\n    \u003Cp\u003E Hello and welcome to our experiment.\u003C\u002Fp\u003E\r\n    \u003Cp\u003EMake sure you can work for 25 minutes without any interruption. Please avoid any distractions (i.e., TV, music, smartphones, kids, cats). \u003Cb\u003EPlease don't leave the study tab or switch windows on your computer while the experiment is ongoing. Doing so will disqualify you from continuing the experiment and you will not receive compensation on Prolific.\u003C\u002Fb\u003E Your cooperation will make sure we have high quality data for scientific inferences.\u003C\u002Fp\u003E\r\n \u003C!--  \u003Cp\u003E Please enter your personal subject number in the field. If you do not remember the number, restart the experiment. \u003C\u002Fp\u003E\r\n    \u003Cform\u003E\r\n      \u003Cinput name=\"subj\" id=\"subj\" required\u003E\r\n      \u003Cbutton for=\"subj\" type=\"submit\"\u003EContinue\u003C\u002Fbutton\u003E\r\n    \u003C\u002Fform\u003E --\u003E \r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n  Press the SPACE bar to continue\r\n\u003C\u002Ffooter\u003E\r\n\r\n\r\n\r\n\r\n"
    },
    {
      "type": "lab.html.Form",
      "content": "\u003Cstyle\u003E\n#div1{width: 800px;text-align: left;}\nheader{  padding: 5px;  height: 120px;}\nfooter{  padding: 5px;  height: 100px;}\ndt{line-height: 2;font-weight: bold;}\ntable, th, td {  border: 1px solid black;\n  border-collapse: collapse;  background-color: #ecf2f9;}\nth, td {  padding: 1px;}\n\u003C\u002Fstyle\u003E\n\n\u003Cheader\u003E\n\u003Ch2\u003E Information on the study and consent form \u003C\u002Fh2\u003E\u003C\u002Fheader\u003E\n\n\u003Cmain class=\"content-horizontal-center\"\u003E\n\u003Cform id = \"consent\"\u003E\n\u003Cdiv id = \"div1\"\u003E\n \u003Cspan\u003E \u003Cb\u003EPlease read the information carefully.\u003C\u002Fb\u003E\u003C\u002Fspan\u003E\n\u003Cp\u003E\n \u003Cdl\u003E\u003Cdt\u003EAim of the study\u003C\u002Fdt\u003E\n \u003Cdd\u003EThis study examines the mental mechanisms involved in memory for letters and locations. You will be asked to memorize a series of letters in different locations and you will have to recall the letters in each location. You will receive more detail instructions as you go along.\u003C\u002Fdd\u003E \n \u003C\u002Fp\u003E \n \u003Cp\u003E\n \u003Cdt\u003ERequirements\u003C\u002Fdt\u003E\n \u003Cdd\u003ETo participate in this study, you must be between 18-35 years old and you must be a native English speaker.\u003C\u002Fdd\u003E\n \u003C\u002Fp\u003E\n\u003Cp\u003E\n \u003Cdt\u003EPossible advantages and benefits of participating in the study\u003C\u002Fdt\u003E\n \u003Cdd\u003E Participating in the present experiment will provide an important contribution to current cognition research and it offers an interesting insight into how cognition research is conducted.\u003C\u002Fdd\u003E\n\u003C\u002Fp\u003E\n\u003Cp\u003E\n \u003Cdt\u003EVoluntary participation\u003C\u002Fdt\u003E\n \u003Cdd\u003EYour participation in this study is voluntary. You have the right to waive your participation and you have the possibility to revoke your consent at any time and thus to terminate the study prematurely. The withdrawal from the study does not need to be justified.\u003C\u002Fdd\u003E\n\u003C\u002Fp\u003E\n\u003Cp\u003E\n \u003Cdt\u003EPossible disadvantages\u003C\u002Fdt\u003E\n \u003Cdd\u003EThere are none known.\u003C\u002Fdd\u003E\n\u003C\u002Fp\u003E\n\u003Cp\u003E\n \u003Cdt\u003EConfidentiality of data\u003C\u002Fdt\u003E\n \u003Cdd\u003EThe personal data collected in this study will be made anonymous by means of coding and will only be accessible to experts for scientific evaluation or members of the Ethics Committee of the Faculty of Philosophy of the University of Zurich for testing and control purposes in strict compliance with confidentiality. Subsequent publications of the data are based on mean values of the study results, making it impossible to draw conclusions about individuals.\u003C\u002Fdd\u003E\n\u003C\u002Fp\u003E\n\n\u003Cp\u003E\n\u003Cdt\u003E Duration of the study \u003C\u002Fdt\u003E\n \u003Cdd\u003EThe study takes 25 minutes in total.\u003C\u002Fdd\u003E\n\u003C\u002Fp\u003E\n\n  \u003Cp\u003E \u003Cb\u003EIf you agree with all the points listed, please check all the following boxes:\u003C\u002Fb\u003E\u003Cbr\u003E \u003C\u002Fp\u003E\n   \u003Cinput type=\"checkbox\" name=\"consent1\" id=\"consent1\" required\u003E\n    \u003Clabel for=\"consent1\"\u003EI confirm that I have read and understood all information on the study.\u003C\u002Flabel\u003E\u003Cbr\u003E \n    \u003Cinput type=\"checkbox\" name=\"consent2\" id=\"consent2\" required\u003E\n    \u003Clabel for=\"consent2\"\u003EI have taken note that participation in this experiment is voluntary and that I can cancel it at any time and without consequences.\u003C\u002Flabel\u003E\u003Cbr\u003E \n   \u003Cinput type=\"checkbox\" name=\"consent3\" id=\"consent3\" required\u003E\n    \u003Clabel for=\"consent3\"\u003EI confirm that I am at least 18 years old and want to participate in this study.\u003C\u002Flabel\u003E\u003Cbr\u003E \n\n\u003Cp\u003E\u003C\u002Fp\u003E\n    \u003Cdt\u003EProlific-ID\u003C\u002Fdt\u003E\n      Please type in your Prolific-ID here. This will only be used if there are any issues with your submission and we need to associate your ID with your data. We will delete your Prolific-ID permanently after the data collection is finished\u003C\u002Fp\u003E\n  \u003Cinput type=\"text\" name=\"prolific_id\" id=\"prolific_id\" required size=\"50\"\u003E\n   \n\u003C\u002Fdiv\u003E\n\u003C\u002Fform\u003E\n\u003C\u002Fmain\u003E\n\n\u003Cfooter\u003E\n  \u003Cbutton type=\"submit\" form = \"consent\" \u003E Continue\u003C\u002Fbutton\u003E\n\u003C\u002Ffooter\u003E\n",
      "scrollTop": true,
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "Informed Consent"
    },
    {
      "type": "lab.canvas.Screen",
      "content": [
        {
          "type": "i-text",
          "left": 13,
          "top": -200,
          "angle": 0,
          "width": 751.42,
          "height": 91.12,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "In this experiment you will see a series of letters presented one at a \ntime in different locations on the screen. Your task is to remember each letter and \nthe location in which it appeared. For example, you may see the following sequence of letters, \npresented one at a time: ",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 15,
          "top": 112,
          "angle": 0,
          "width": 753,
          "height": 138.31,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "After all letters are presented, your memory will be tested in the following way. All boxes will be\nempty. Then a ? will appear in one of the boxes. You have to press the keyboard key for the\nletter that appeared in that box. In the example below you have to press \"C\". After you press \nthe key, the question mark will appear in another box, and you have to press again the \nkey corresponding to the correct letter. This will continue until you have been tested \non all letters in the list. ",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "rect",
          "left": 0,
          "top": -113,
          "angle": 0,
          "width": 50,
          "height": 50,
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        {
          "type": "rect",
          "left": 63,
          "top": -50,
          "angle": 0,
          "width": 50,
          "height": 50,
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        {
          "type": "rect",
          "left": 0,
          "top": 0,
          "angle": 0,
          "width": 50,
          "height": 50,
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        {
          "type": "rect",
          "left": -64,
          "top": -50,
          "angle": 0,
          "width": 50,
          "height": 50,
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        {
          "type": "i-text",
          "left": 0,
          "top": -112,
          "angle": 0,
          "width": 21.34,
          "height": 36.16,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "B",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": 32,
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 60,
          "top": -50,
          "angle": 0,
          "width": 23.11,
          "height": 36.16,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "C",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": 32,
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 0,
          "top": 0,
          "angle": 0,
          "width": 21.34,
          "height": 36.16,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "X",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": 32,
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": -64,
          "top": -50,
          "angle": 0,
          "width": 19.55,
          "height": 36.16,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "F",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": 32,
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "rect",
          "left": "-60",
          "top": "245",
          "angle": 0,
          "width": 33.33,
          "height": 33.33,
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        {
          "type": "rect",
          "left": -14.5,
          "top": 215,
          "angle": 0,
          "width": 33.33,
          "height": 33.33,
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        {
          "type": "rect",
          "left": -13.5,
          "top": 275,
          "angle": 0,
          "width": 33.33,
          "height": 33.33,
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        {
          "type": "rect",
          "left": "35",
          "top": "245",
          "angle": 0,
          "width": 33.33,
          "height": 33.33,
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        {
          "type": "i-text",
          "left": 35,
          "top": "245",
          "angle": 0,
          "width": 13.35,
          "height": 27.12,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "?",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "24",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        }
      ],
      "viewport": [
        800,
        600
      ],
      "files": {},
      "responses": {
        "keydown(Space)": ""
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "Instructions"
    },
    {
      "type": "lab.canvas.Screen",
      "content": [
        {
          "type": "i-text",
          "left": 0,
          "top": -175,
          "angle": 0,
          "width": 661.6,
          "height": 161.91,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "IMPORTANT!\n\nThe number of letters on each list will vary. Importantly, there are two types of lists. \nOn the first type of list, you will have to remember all of the letters on the list.\n\nOn the second type of list, after one of the letters you will see 3 red # symbols\nin the middle of the screen. For example like this:",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 0,
          "top": -50,
          "angle": 0,
          "width": 53.39,
          "height": 36.16,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "#d6341a",
          "text": "###",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": 32,
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 0,
          "top": 25,
          "angle": 0,
          "width": 668.81,
          "height": 91.12,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "#000000",
          "text": "This means that the letters you have seen so far on this list won't be tested, and you\nonly need to remember the order of the letters that appear after the ### symbol.\n\nFor example, if you see the following sequence of words:",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 0,
          "top": 213,
          "angle": 0,
          "width": 700.36,
          "height": 138.31,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "you don't need to remember the letters B and F, because they appeared\nbefore the ### symbol. You will NOT know in advance whether the list will have\nthe ### symbol in the middle, so do your best to remember all letters from the begining. \nHowever, if you do see the ### symbol, feel free to forget the letters that came before it.\n\nPress SPACE to continue.",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": -36,
          "top": 110,
          "angle": 0,
          "width": 36.01,
          "height": 20.34,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "B, F,",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 11,
          "top": 110,
          "angle": 0,
          "width": 35.03,
          "height": 20.34,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "#d6341a",
          "text": "###,",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 75,
          "top": 110,
          "angle": 0,
          "width": 82.01,
          "height": 20.34,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "X, C, D, G",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        }
      ],
      "viewport": [
        800,
        600
      ],
      "files": {},
      "responses": {
        "keydown(Space)": ""
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "Instructions2"
    },
    {
      "type": "lab.canvas.Screen",
      "content": [
        {
          "type": "i-text",
          "left": 0,
          "top": 0,
          "angle": 0,
          "width": 424.49,
          "height": 67.53,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "You will first practice the task with a few practice lists.\n\nPress SPACE to begin the practice session.",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        }
      ],
      "viewport": [
        800,
        600
      ],
      "files": {},
      "responses": {
        "keydown(Space)": ""
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "Instructions3"
    },
    {
      "type": "lab.flow.Loop",
      "templateParameters": [
        {
          "": "1"
        }
      ],
      "sample": {
        "mode": "draw-shuffle",
        "n": "4"
      },
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "PracticeTrialLoop",
      "tardy": true,
      "shuffleGroups": [],
      "template": {
        "type": "lab.flow.Sequence",
        "files": {},
        "responses": {
          "": ""
        },
        "parameters": {},
        "messageHandlers": {},
        "title": "TrialSequence",
        "content": [
          {
            "type": "lab.html.Screen",
            "files": {},
            "responses": {
              "keydown": "",
              "click": ""
            },
            "parameters": {},
            "messageHandlers": {
              "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}

funs.draw_text('+',0,0, '60px Arial');
funs.draw_text('(press SPACE to begin the next list)',0,350, '18px Arial');
Trial_counter++;
Stim_counter = 0;
Test_counter = 0;
window.responses = [];
}
            },
            "title": "Fixation",
            "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E"
          },
          {
            "type": "lab.html.Screen",
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {
              "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}
}
            },
            "title": "Blank",
            "timeout": "${pars.blank_time}",
            "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E"
          },
          {
            "type": "lab.flow.Loop",
            "templateParameters": [
              {
                "": "1"
              }
            ],
            "sample": {
              "mode": "draw-shuffle",
              "n": "${pars.set_size1[Trial_counter]}"
            },
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {},
            "title": "EncodingLoop1",
            "tardy": true,
            "shuffleGroups": [],
            "template": {
              "type": "lab.flow.Sequence",
              "files": {},
              "responses": {
                "": ""
              },
              "parameters": {},
              "messageHandlers": {},
              "title": "EncodingSequence",
              "content": [
                {
                  "type": "lab.html.Screen",
                  "files": {},
                  "responses": {
                    "": ""
                  },
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

stim = pars.trial_words1[Trial_counter][Stim_counter]
loc = pars.trial_locations1[Trial_counter][Stim_counter]

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}


funs.draw_text(stim,pars.box_xy[loc][0],pars.box_xy[loc][1], '45px Arial')
},
                    "end": function anonymous(
) {
this.data.stim = stim;
this.data.input_position = Stim_counter+1;
this.data.trial = Trial_counter+1;
this.data.setsize = pars.set_size1[Trial_counter];
this.data.trial_type = pars.trial_type[Trial_counter];
this.data.trial_part = "first";
this.data.practice = 'practice';
this.data.stim_loc = loc;
Stim_counter++

}
                  },
                  "title": "Stim",
                  "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
                  "timeout": "${pars.stim_time}",
                  "tardy": true
                },
                {
                  "type": "lab.html.Screen",
                  "files": {},
                  "responses": {
                    "": ""
                  },
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}
}
                  },
                  "title": "ISI",
                  "timeout": "${pars.isi}",
                  "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
                  "tardy": true
                }
              ]
            }
          },
          {
            "type": "lab.html.Screen",
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {
              "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}

funs.draw_text('###',0,0, '90px Arial', 'red');
Stim_counter = 0;
}
            },
            "title": "ForgetMark",
            "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
            "timeout": "${pars.forget_time}",
            "skip": "${pars.trial_type[Trial_counter] === \"first\"}",
            "tardy": true
          },
          {
            "type": "lab.html.Screen",
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {
              "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}
}
            },
            "title": "ISI",
            "timeout": "${pars.forget_isi}",
            "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
            "tardy": true
          },
          {
            "type": "lab.flow.Loop",
            "templateParameters": [
              {
                "": "1"
              }
            ],
            "sample": {
              "mode": "draw-shuffle",
              "n": "${pars.set_size2}"
            },
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {},
            "title": "EncodingLoop2",
            "tardy": true,
            "skip": "${pars.trial_type[Trial_counter] === \"first\"}",
            "shuffleGroups": [],
            "template": {
              "type": "lab.flow.Sequence",
              "files": {},
              "responses": {
                "": ""
              },
              "parameters": {},
              "messageHandlers": {},
              "title": "EncodingSequence",
              "content": [
                {
                  "type": "lab.html.Screen",
                  "files": {},
                  "responses": {
                    "": ""
                  },
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

stim = pars.trial_words2[Trial_counter][Stim_counter]
loc = pars.trial_locations2[Trial_counter][Stim_counter]

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}


funs.draw_text(stim,pars.box_xy[loc][0],pars.box_xy[loc][1], '45px Arial')
},
                    "end": function anonymous(
) {
this.data.stim = stim;
this.data.input_position = Stim_counter+1;
this.data.trial = Trial_counter+1;
this.data.setsize1 = pars.set_size1[Trial_counter];
this.data.trial_type = pars.trial_type[Trial_counter];
this.data.trial_part = "second";
this.data.practice = 'practice';
this.data.stim_loc = loc;
Stim_counter++

}
                  },
                  "title": "Stim",
                  "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
                  "timeout": "${pars.stim_time}",
                  "tardy": true
                },
                {
                  "type": "lab.html.Screen",
                  "files": {},
                  "responses": {
                    "": ""
                  },
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}
}
                  },
                  "title": "ISI",
                  "timeout": "${pars.isi}",
                  "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
                  "tardy": true
                }
              ]
            }
          },
          {
            "type": "lab.html.Screen",
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {
              "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}

funs.draw_text('???',0,0, '60px Arial');
if (pars.trial_type[Trial_counter] == "first") {
  pars.test_order = pars.test_order1[Trial_counter];
  pars.trial_locs = pars.trial_locations1[Trial_counter];
  pars.trial_stim = pars.trial_words1[Trial_counter];
} else {
  pars.test_order = pars.test_order2[Trial_counter];
  pars.trial_locs = pars.trial_locations2[Trial_counter];
  pars.trial_stim = pars.trial_words2[Trial_counter];
}



}
            },
            "title": "QuestionMark",
            "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
            "timeout": "${pars.q_time}"
          },
          {
            "type": "lab.flow.Loop",
            "templateParameters": [
              {
                "": "1"
              }
            ],
            "sample": {
              "mode": "draw-shuffle",
              "n": "${pars.test_order.length}"
            },
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {},
            "title": "TestLoop",
            "tardy": true,
            "shuffleGroups": [],
            "template": {
              "type": "lab.flow.Sequence",
              "files": {},
              "responses": {
                "": ""
              },
              "parameters": {},
              "messageHandlers": {},
              "title": "TestSequence",
              "content": [
                {
                  "type": "lab.html.Screen",
                  "files": {},
                  "responses": {
                    "keydown(b, B)": "B",
                    "keydown(c, C)": "C",
                    "keydown(d, D)": "D",
                    "keydown(f, F)": "F",
                    "keydown(g, G)": "G",
                    "keydown(j, J)": "J",
                    "keydown(k, K)": "K",
                    "keydown(l, L)": "L",
                    "keydown(m, M)": "M",
                    "keydown(n, N)": "N",
                    "keydown(p, P)": "P",
                    "keydown(q, Q)": "Q",
                    "keydown(s, S)": "S",
                    "keydown(t, T)": "T",
                    "keydown(v, V)": "V",
                    "keydown(x, X)": "X",
                    "keydown(z, Z)": "Z"
                  },
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

stim = pars.trial_stim[pars.test_order[Test_counter]-1]
loc = pars.trial_locs[pars.test_order[Test_counter]-1]

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}


funs.draw_text("?",pars.box_xy[loc][0],pars.box_xy[loc][1], '45px Arial')




},
                    "end": function anonymous(
) {
window.responses.push(this.data.response)
correct_response = stim;
this.data.correct_response = correct_response;
this.data.input_position = pars.test_order[Test_counter];
this.data.location = loc;
this.data.trial = Trial_counter+1;
this.data.response_position = Test_counter+1;
this.data.setsize = pars.set_size1[Trial_counter];
this.data.trial_type = pars.trial_type[Trial_counter];
this.data.practice = 'practice';
this.data.acc = this.data.response == correct_response ? 1 : 0;
Test_counter++;
}
                  },
                  "title": "Reconstruction",
                  "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E"
                }
              ]
            }
          },
          {
            "type": "lab.html.Screen",
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {},
            "title": "Blank",
            "timeout": "250"
          }
        ]
      }
    },
    {
      "type": "lab.canvas.Screen",
      "content": [
        {
          "type": "i-text",
          "left": 0,
          "top": 0,
          "angle": 0,
          "width": 601.34,
          "height": 161.91,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "This concludes the practice. The experiment will now begin.\nPlease focus and avoid any distractions until the experiment is complete.\nAt the end of the experiment you will see what % of words you were\nable to remember in order. Please try your best, but do not use any help, as\nthis will invalidate the data.\n\nPress SPACE to begin.",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        }
      ],
      "viewport": [
        800,
        600
      ],
      "files": {},
      "responses": {
        "keydown": ""
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "Instructions4"
    },
    {
      "type": "lab.flow.Loop",
      "templateParameters": [
        {
          "": "1"
        }
      ],
      "sample": {
        "mode": "draw-shuffle",
        "n": "${pars.n_trials+pars.n_buffer}"
      },
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "TrialLoop",
      "tardy": true,
      "shuffleGroups": [],
      "template": {
        "type": "lab.flow.Sequence",
        "files": {},
        "responses": {
          "": ""
        },
        "parameters": {},
        "messageHandlers": {},
        "title": "TrialSequence",
        "content": [
          {
            "type": "lab.html.Screen",
            "files": {},
            "responses": {
              "keydown": "",
              "click": ""
            },
            "parameters": {},
            "messageHandlers": {
              "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}

funs.draw_text('+',0,0, '60px Arial');
Trial_counter++;
Stim_counter = 0;
Test_counter = 0;
window.responses = [];
}
            },
            "title": "Fixation",
            "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E"
          },
          {
            "type": "lab.html.Screen",
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {
              "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}
}
            },
            "title": "Blank",
            "timeout": "${pars.blank_time}",
            "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E"
          },
          {
            "type": "lab.flow.Loop",
            "templateParameters": [
              {
                "": "1"
              }
            ],
            "sample": {
              "mode": "draw-shuffle",
              "n": "${pars.set_size1[Trial_counter]}"
            },
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {},
            "title": "EncodingLoop1",
            "tardy": true,
            "shuffleGroups": [],
            "template": {
              "type": "lab.flow.Sequence",
              "files": {},
              "responses": {
                "": ""
              },
              "parameters": {},
              "messageHandlers": {},
              "title": "EncodingSequence",
              "content": [
                {
                  "type": "lab.html.Screen",
                  "files": {},
                  "responses": {
                    "": ""
                  },
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

stim = pars.trial_words1[Trial_counter][Stim_counter]
loc = pars.trial_locations1[Trial_counter][Stim_counter]

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}


funs.draw_text(stim,pars.box_xy[loc][0],pars.box_xy[loc][1], '45px Arial')
},
                    "end": function anonymous(
) {
this.data.stim = stim;
this.data.input_position = Stim_counter+1;
this.data.trial = Trial_counter+1;
this.data.setsize = pars.set_size1[Trial_counter];
this.data.trial_type = pars.trial_type[Trial_counter];
this.data.trial_part = "first";
this.data.stim_loc = loc;
Stim_counter++

}
                  },
                  "title": "Stim",
                  "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
                  "timeout": "${pars.stim_time}",
                  "tardy": true
                },
                {
                  "type": "lab.html.Screen",
                  "files": {},
                  "responses": {
                    "": ""
                  },
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}
}
                  },
                  "title": "ISI",
                  "timeout": "${pars.isi}",
                  "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
                  "tardy": true
                }
              ]
            }
          },
          {
            "type": "lab.html.Screen",
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {
              "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}

funs.draw_text('###',0,0, '90px Arial', 'red');
Stim_counter = 0;
}
            },
            "title": "ForgetMark",
            "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
            "timeout": "${pars.forget_time}",
            "skip": "${pars.trial_type[Trial_counter] === \"first\"}",
            "tardy": true
          },
          {
            "type": "lab.html.Screen",
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {
              "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}
}
            },
            "title": "ISI",
            "timeout": "${pars.forget_isi}",
            "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
            "tardy": true
          },
          {
            "type": "lab.flow.Loop",
            "templateParameters": [
              {
                "": "1"
              }
            ],
            "sample": {
              "mode": "draw-shuffle",
              "n": "${pars.set_size2}"
            },
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {},
            "title": "EncodingLoop2",
            "tardy": true,
            "skip": "${pars.trial_type[Trial_counter] === \"first\"}",
            "shuffleGroups": [],
            "template": {
              "type": "lab.flow.Sequence",
              "files": {},
              "responses": {
                "": ""
              },
              "parameters": {},
              "messageHandlers": {},
              "title": "EncodingSequence",
              "content": [
                {
                  "type": "lab.html.Screen",
                  "files": {},
                  "responses": {
                    "": ""
                  },
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

stim = pars.trial_words2[Trial_counter][Stim_counter]
loc = pars.trial_locations2[Trial_counter][Stim_counter]

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}


funs.draw_text(stim,pars.box_xy[loc][0],pars.box_xy[loc][1], '45px Arial')
},
                    "end": function anonymous(
) {
this.data.stim = stim;
this.data.input_position = Stim_counter+1;
this.data.trial = Trial_counter+1;
this.data.setsize1 = pars.set_size1[Trial_counter];
this.data.trial_type = pars.trial_type[Trial_counter];
this.data.trial_part = "second";
this.data.practice = 'practice';
this.data.stim_loc = loc;
Stim_counter++

}
                  },
                  "title": "Stim",
                  "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
                  "timeout": "${pars.stim_time}",
                  "tardy": true
                },
                {
                  "type": "lab.html.Screen",
                  "files": {},
                  "responses": {
                    "": ""
                  },
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}
}
                  },
                  "title": "ISI",
                  "timeout": "${pars.isi}",
                  "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
                  "tardy": true
                }
              ]
            }
          },
          {
            "type": "lab.html.Screen",
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {
              "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}

funs.draw_text('???',0,0, '60px Arial');
if (pars.trial_type[Trial_counter] == "first") {
  pars.test_order = pars.test_order1[Trial_counter];
  pars.trial_locs = pars.trial_locations1[Trial_counter];
  pars.trial_stim = pars.trial_words1[Trial_counter];
} else {
  pars.test_order = pars.test_order2[Trial_counter];
  pars.trial_locs = pars.trial_locations2[Trial_counter];
  pars.trial_stim = pars.trial_words2[Trial_counter];
}



}
            },
            "title": "QuestionMark",
            "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E",
            "timeout": "${pars.q_time}"
          },
          {
            "type": "lab.flow.Loop",
            "templateParameters": [
              {
                "": "1"
              }
            ],
            "sample": {
              "mode": "draw-shuffle",
              "n": "${pars.test_order.length}"
            },
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {},
            "title": "TestLoop",
            "tardy": true,
            "shuffleGroups": [],
            "template": {
              "type": "lab.flow.Sequence",
              "files": {},
              "responses": {
                "": ""
              },
              "parameters": {},
              "messageHandlers": {},
              "title": "TestSequence",
              "content": [
                {
                  "type": "lab.html.Screen",
                  "files": {},
                  "responses": {
                    "keydown(b, B)": "B",
                    "keydown(c, C)": "C",
                    "keydown(d, D)": "D",
                    "keydown(f, F)": "F",
                    "keydown(g, G)": "G",
                    "keydown(j, J)": "J",
                    "keydown(k, K)": "K",
                    "keydown(l, L)": "L",
                    "keydown(m, M)": "M",
                    "keydown(n, N)": "N",
                    "keydown(p, P)": "P",
                    "keydown(q, Q)": "Q",
                    "keydown(s, S)": "S",
                    "keydown(t, T)": "T",
                    "keydown(v, V)": "V",
                    "keydown(x, X)": "X",
                    "keydown(z, Z)": "Z"
                  },
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

stim = pars.trial_stim[pars.test_order[Test_counter]-1]
loc = pars.trial_locs[pars.test_order[Test_counter]-1]

for (i=0; i<pars.box_xy.length; i++) {
  funs.draw_box_div(i+1, pars.box_xy[i][0],pars.box_xy[i][1],pars.box_size,pars.box_size);
}


funs.draw_text("?",pars.box_xy[loc][0],pars.box_xy[loc][1], '45px Arial')




},
                    "end": function anonymous(
) {
window.responses.push(this.data.response)
correct_response = stim;
this.data.correct_response = correct_response;
this.data.input_position = pars.test_order[Test_counter];
this.data.location = loc;
this.data.trial = Trial_counter+1;
this.data.response_position = Test_counter+1;
this.data.setsize = pars.set_size1[Trial_counter];
this.data.trial_type = pars.trial_type[Trial_counter];
this.data.practice = 'practice';
this.data.acc = this.data.response == correct_response ? 1 : 0;
Overall_accuracy.push(this.data.acc);
Test_counter++;
}
                  },
                  "title": "Reconstruction",
                  "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box7\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box8\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box9\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box10\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box11\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box12\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E"
                }
              ]
            }
          },
          {
            "type": "lab.html.Screen",
            "files": {},
            "responses": {
              "": ""
            },
            "parameters": {},
            "messageHandlers": {},
            "title": "Blank",
            "timeout": "250"
          }
        ]
      }
    },
    {
      "type": "lab.canvas.Screen",
      "content": [
        {
          "type": "i-text",
          "left": 0,
          "top": 0,
          "angle": 0,
          "width": 591.02,
          "height": 67.53,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "You succesfully remembered ${window.acc_perc}% of the letter locations!\n\nPress SPACE to go to the final questionaire before ending the experiment.",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        }
      ],
      "viewport": [
        800,
        600
      ],
      "files": {},
      "responses": {
        "keydown(Space)": ""
      },
      "parameters": {},
      "messageHandlers": {
        "before:prepare": function anonymous(
) {
function calculateAverage(array) {
    var total = 0;
    var count = 0;

    array.forEach(function(item, index) {
        total += item;
        count++;
    });

    return total / count;
}

acc_perc = calculateAverage(Overall_accuracy);
acc_perc = Math.round(acc_perc*100);
}
      },
      "title": "AccuracyFeedback",
      "tardy": true
    },
    {
      "type": "lab.html.Page",
      "items": [
        {
          "type": "text",
          "title": "Thank you!",
          "content": "Thank you for participating in the experiment. Please answer these final questions truthfully - your responses will not affect your compensation."
        },
        {
          "required": true,
          "type": "radio",
          "options": [
            {
              "label": "Yes, I used external aid",
              "coding": "Yes"
            },
            {
              "label": "No, I did not use external aid",
              "coding": "No"
            }
          ],
          "label": "Did you use any aid to remember the words (e.g., by writing them down on a piece of paper or in a computer file)?",
          "name": "use_help"
        },
        {
          "required": true,
          "type": "radio",
          "label": "Did you do the task diligently? If not, please let us know so that we don't analyze your data.",
          "options": [
            {
              "label": "Yes, I did the task as best as I could, you can analyze my data",
              "coding": "Yes"
            },
            {
              "label": "No, I did not do the task diligently, you should not analyze my data",
              "coding": "No"
            }
          ],
          "name": "did-you-do-the-task-diligently-if-not-please-let-us-know-so-that-we-don't-analyze-your-data."
        }
      ],
      "scrollTop": true,
      "submitButtonText": "Continue to submit your data to Prolific",
      "submitButtonPosition": "right",
      "files": {},
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {},
      "title": "Thanks"
    },
    {
      "type": "lab.canvas.Screen",
      "content": [
        {
          "type": "i-text",
          "left": 0,
          "top": 25,
          "angle": 0,
          "width": 634.11,
          "height": 152.96,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "Your data is being saved. This can take a few seconds. \nYou will be automatically redirected to Profilic after the data \ntransmition is complete.\n\nThank you for your participation! ",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "24",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "image",
          "left": 0,
          "top": -190,
          "angle": 0,
          "width": 151.38,
          "height": 151.38,
          "stroke": null,
          "strokeWidth": 0,
          "fill": "black",
          "src": "${ this.files[\"loading_symbol.png\"] }"
        },
        {
          "type": "i-text",
          "left": 0,
          "top": 225,
          "angle": 0,
          "width": 690.54,
          "height": 67.53,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "If you don't get redirected automatically after one minute, please contact us with \nProlific's messaging. Please write the code word \"ORDER\" to prove you have reached \nthis part if you are not redirected automatically.",
          "fontStyle": "italic",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        }
      ],
      "viewport": [
        800,
        600
      ],
      "files": {
        "loading_symbol.png": "embedded\u002Ffdd21f8597f1df107fccb19c1647e961265a6502796608a6a0275af46fd9698b.png"
      },
      "responses": {
        "": ""
      },
      "parameters": {},
      "messageHandlers": {
        "before:prepare": function anonymous(
) {
var resultJson = study.options.datastore.exportJson();
jatos.submitResultData(resultJson);
}
      },
      "title": "Submit _Data",
      "timeout": "10000",
      "tardy": true
    }
  ]
})

// Let's go!
jatos.onLoad(() => study.run())