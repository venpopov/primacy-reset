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
    "title": "Primacy-resource-exp1b_250",
    "description": "Pilot experiment with only words, and a reset screen.",
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
    console.log(box);
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
  n_trials: 48,
  stim_time: 750,
  blank_time: 500,
  isi: 250,
  q_time: 1000,
  forget_time: 250,
  canvas_width: 1000,
  canvas_height: 750,
  set_size2: 6, // number of items in the second array
  combined_max_setsize: 12
}

let all_words = [ "airplane", "apple","bacon","badge","banana","barn","barrel","basement","basket","beach","bedroom","belt","bible","bike","blanket","bone","boot","bowl","brain","branch","bread","brick","bride","bridge","bucket","buffalo","burger","bush","butler","cabin","cage","camera","carpet","casino","castle","cave","chair","cherry","chicken","child","chin","church","cigar","circus","clinic","cloud","clown","coast","cocktail","concert","cookie","corn","costume","couch","crown","curtain","dentist","dessert","devil","diamond","dice","doctor","dog","dragon","eagle","earth","elephant","elevator","empire","factory","finger","flower","forest","fort","frog","fruit","garden","glove","goat","goose","guitar","hammer","harbor","heart","highway","horn","horse","house","island","jeep","jewelry","jungle","knee","knife","lamp","lawn","lawyer","lemon","library","lion","liver","market","medal","monkey","mouse","nail","nanny","needle","nest","newspaper","nurse","ocean","opera","orange","palace","passport","peanut","pearl","penny","phone","piano","pill","pillow","pilot","pipe","pistol","pizza","planet","pole","potato","priest","pumpkin","purse","rabbit","railroad","ranch","robin","robot","sandwich","satellite","school","shark","sheep","shotgun","sink","skull","soda","soldier","spider","stairs","statue","steak","string","surgeon","sweater","table","tank","taxi","tent","tiger","tire","toast","tooth","towel","tower","train","tunnel","turtle","underwear","universe","valley","virus","waiter","wallet","whale","whistle","window","wolf","worm","wrist"]
all_words = this.random.shuffle(all_words);
exp_words = all_words.slice(0,pars.combined_max_setsize) // sample 12 words for this participants

// generate set sizes for part 1
pars.set_size1 = Array(pars.n_trials/6).fill([1,2,3,4,5,6]).flat();

// determine if first part is tested
pars.trial_type = Array(pars.n_trials/2).fill(['first']).flat();
pars.trial_type.push(Array(pars.n_trials/2).fill(['full']).flat());
pars.trial_type = pars.trial_type.flat();

// shuffle set size and trial_type and add practice and buffer trials
funs.shuffle_multiple(pars.set_size1, pars.trial_type)

for (i=0;i<pars.n_buffer;i++) {
  pars.set_size1.unshift(6);
  pars.trial_type.unshift('first');
}
pars.set_size1.unshift(4,2,5,5);
pars.trial_type.unshift('first','full','first','full');



// select words for each trial
let trial_words1 = [];
let trial_words2 = [];
for (i=0; i < pars.set_size1.length; i++) {
  let trial_words = this.random.shuffle(exp_words);
  let trial_set_size = pars.set_size1[i];
  let words1 = [];
  for (j=0; j < trial_set_size; j++) {
    let word = trial_words.pop();
    words1.push(word);
  }
  // select words for the second part in full trials
  let words2 = [];
  if (pars.trial_type[i] == "full") {
    for (k=0; k<pars.set_size2; k++) {
      let word = trial_words.pop();
      words2.push(word);
    }
  }
  trial_words1.push(words1);
  trial_words2.push(words2);
}
pars.trial_words1 = trial_words1;
pars.trial_words2 = trial_words2;




}
      },
      "title": "Intro (script)",
      "content": "\u003Cheader\u003E\r\n  \u003Ch1\u003E Welcome to the study!\u003C\u002Fh1\u003E\r\n\u003C\u002Fheader\u003E\r\n\r\n\u003Cstyle\u003E\r\n  #div1{width: 600px;text-align: center;}\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center\"\u003E\r\n  \u003Cdiv id=\"div1\"\u003E\r\n    \u003Cp\u003E Hello and welcome to our experiment.\u003C\u002Fp\u003E\r\n    \u003Cp\u003EMake sure you can work for 20 minutes without any interruption. Please avoid any distractions (i.e., TV, music, smartphones, kids, cats). \u003Cb\u003EPlease don't leave the study tab or switch windows on your computer while the experiment is ongoing. Doing so will disqualify you from continuing the experiment and you will not receive compensation on Prolific.\u003C\u002Fb\u003E Your cooperation will make sure we have high quality data for scientific inferences.\u003C\u002Fp\u003E\r\n \u003C!--  \u003Cp\u003E Please enter your personal subject number in the field. If you do not remember the number, restart the experiment. \u003C\u002Fp\u003E\r\n    \u003Cform\u003E\r\n      \u003Cinput name=\"subj\" id=\"subj\" required\u003E\r\n      \u003Cbutton for=\"subj\" type=\"submit\"\u003EContinue\u003C\u002Fbutton\u003E\r\n    \u003C\u002Fform\u003E --\u003E \r\n  \u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E\r\n\r\n\u003Cfooter\u003E\r\n  Press the SPACE bar to continue\r\n\u003C\u002Ffooter\u003E\r\n\r\n\r\n\r\n\r\n"
    },
    {
      "type": "lab.html.Form",
      "content": "\u003Cstyle\u003E\n#div1{width: 800px;text-align: left;}\nheader{  padding: 5px;  height: 120px;}\nfooter{  padding: 5px;  height: 100px;}\ndt{line-height: 2;font-weight: bold;}\ntable, th, td {  border: 1px solid black;\n  border-collapse: collapse;  background-color: #ecf2f9;}\nth, td {  padding: 1px;}\n\u003C\u002Fstyle\u003E\n\n\u003Cheader\u003E\n\u003Ch2\u003E Information on the study and consent form \u003C\u002Fh2\u003E\u003C\u002Fheader\u003E\n\n\u003Cmain class=\"content-horizontal-center\"\u003E\n\u003Cform id = \"consent\"\u003E\n\u003Cdiv id = \"div1\"\u003E\n \u003Cspan\u003E \u003Cb\u003EPlease read the information carefully.\u003C\u002Fb\u003E\u003C\u002Fspan\u003E\n\u003Cp\u003E\n \u003Cdl\u003E\u003Cdt\u003EAim of the study\u003C\u002Fdt\u003E\n \u003Cdd\u003EThis study examines the mental mechanisms involved in memory for words. You will be asked to memorize a series of words and you will have to recall the order in which they were presented. You will receive more detail instructions as you go along.\u003C\u002Fdd\u003E \n \u003C\u002Fp\u003E \n \u003Cp\u003E\n \u003Cdt\u003ERequirements\u003C\u002Fdt\u003E\n \u003Cdd\u003ETo participate in this study, you must be between 18-35 years old and you must be a native English speaker.\u003C\u002Fdd\u003E\n \u003C\u002Fp\u003E\n\u003Cp\u003E\n \u003Cdt\u003EPossible advantages and benefits of participating in the study\u003C\u002Fdt\u003E\n \u003Cdd\u003E Participating in the present experiment will provide an important contribution to current cognition research and it offers an interesting insight into how cognition research is conducted.\u003C\u002Fdd\u003E\n\u003C\u002Fp\u003E\n\u003Cp\u003E\n \u003Cdt\u003EVoluntary participation\u003C\u002Fdt\u003E\n \u003Cdd\u003EYour participation in this study is voluntary. You have the right to waive your participation and you have the possibility to revoke your consent at any time and thus to terminate the study prematurely. The withdrawal from the study does not need to be justified.\u003C\u002Fdd\u003E\n\u003C\u002Fp\u003E\n\u003Cp\u003E\n \u003Cdt\u003EPossible disadvantages\u003C\u002Fdt\u003E\n \u003Cdd\u003EThere are none known.\u003C\u002Fdd\u003E\n\u003C\u002Fp\u003E\n\u003Cp\u003E\n \u003Cdt\u003EConfidentiality of data\u003C\u002Fdt\u003E\n \u003Cdd\u003EThe personal data collected in this study will be made anonymous by means of coding and will only be accessible to experts for scientific evaluation or members of the Ethics Committee of the Faculty of Philosophy of the University of Zurich for testing and control purposes in strict compliance with confidentiality. Subsequent publications of the data are based on mean values of the study results, making it impossible to draw conclusions about individuals.\u003C\u002Fdd\u003E\n\u003C\u002Fp\u003E\n\n\u003Cp\u003E\n\u003Cdt\u003E Duration of the study \u003C\u002Fdt\u003E\n \u003Cdd\u003EThe study takes 20 minutes in total.\u003C\u002Fdd\u003E\n\u003C\u002Fp\u003E\n\n  \u003Cp\u003E \u003Cb\u003EIf you agree with all the points listed, please check all the following boxes:\u003C\u002Fb\u003E\u003Cbr\u003E \u003C\u002Fp\u003E\n   \u003Cinput type=\"checkbox\" name=\"consent1\" id=\"consent1\" required\u003E\n    \u003Clabel for=\"consent1\"\u003EI confirm that I have read and understood all information on the study.\u003C\u002Flabel\u003E\u003Cbr\u003E \n    \u003Cinput type=\"checkbox\" name=\"consent2\" id=\"consent2\" required\u003E\n    \u003Clabel for=\"consent2\"\u003EI have taken note that participation in this experiment is voluntary and that I can cancel it at any time and without consequences.\u003C\u002Flabel\u003E\u003Cbr\u003E \n   \u003Cinput type=\"checkbox\" name=\"consent3\" id=\"consent3\" required\u003E\n    \u003Clabel for=\"consent3\"\u003EI confirm that I am at least 18 years old and want to participate in this study.\u003C\u002Flabel\u003E\u003Cbr\u003E \n\n\u003Cp\u003E\u003C\u002Fp\u003E\n    \u003Cdt\u003EProlific-ID\u003C\u002Fdt\u003E\n      Please type in your Prolific-ID here. This will only be used if there are any issues with your submission and we need to associate your ID with your data. We will delete your Prolific-ID permanently after the data collection is finished\u003C\u002Fp\u003E\n  \u003Cinput type=\"text\" name=\"prolific_id\" id=\"prolific_id\" required size=\"50\"\u003E\n   \n\u003C\u002Fdiv\u003E\n\u003C\u002Fform\u003E\n\u003C\u002Fmain\u003E\n\n\u003Cfooter\u003E\n  \u003Cbutton type=\"submit\" form = \"consent\" \u003E Continue\u003C\u002Fbutton\u003E\n\u003C\u002Ffooter\u003E\n",
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
          "width": 669.33,
          "height": 91.12,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "In this experiment you will see a series of words presented one at a \ntime in the center of the screen. Your task is to remember the words in the \norder in which they appeared. For example, you may see the following list of words, \npresented one at a time, starting with the leftmost one: ",
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
          "top": -125,
          "angle": 0,
          "width": 461.38,
          "height": 20.34,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "CRUST, ASSISTANT, SHOW, MUESLI, MOUNTAIN, SUN",
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
          "width": 718.73,
          "height": 91.12,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "After all words are presented, your memory for their order will be tested in the following \nway. All of the words you have seen will appear together, each in a separate box,\nin a random order. You have to click on each word in the order you remember seeing them\nprior to the test. For example, the test for the list above may look like this:",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "rect",
          "left": 62,
          "top": 62,
          "angle": 0,
          "width": 100,
          "height": 50,
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        {
          "type": "rect",
          "left": -50,
          "top": 62,
          "angle": 0,
          "width": 100,
          "height": 50,
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        {
          "type": "rect",
          "left": -162,
          "top": 61,
          "angle": 0,
          "width": 100,
          "height": 50,
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        {
          "type": "rect",
          "left": -275,
          "top": 60,
          "angle": 0,
          "width": 100,
          "height": 50,
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        {
          "type": "rect",
          "left": 175,
          "top": 62,
          "angle": 0,
          "width": 100,
          "height": 50,
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        {
          "type": "rect",
          "left": 285,
          "top": 62,
          "angle": 0,
          "width": 100,
          "height": 50,
          "stroke": "#000000",
          "strokeWidth": 1,
          "fill": "#ffffff"
        },
        {
          "type": "i-text",
          "left": -275,
          "top": 60,
          "angle": 0,
          "width": 87.72,
          "height": 18.08,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "ASSISTANT",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "16",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": -161,
          "top": 60,
          "angle": 0,
          "width": 59.57,
          "height": 18.08,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "MUESLI",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "16",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": -50,
          "top": 61,
          "angle": 0,
          "width": 55.11,
          "height": 18.08,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "CRUST",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "16",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 61,
          "top": 62,
          "angle": 0,
          "width": 84.14,
          "height": 18.08,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "MOUNTAIN",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "16",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 175,
          "top": 64,
          "angle": 0,
          "width": 33.78,
          "height": 18.08,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "SUN",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "16",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 287,
          "top": 61,
          "angle": 0,
          "width": 49.77,
          "height": 18.08,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "SHOW",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "16",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": -275,
          "top": 100,
          "angle": 0,
          "width": 8.9,
          "height": 18.08,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "2",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "16",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": -161,
          "top": 100,
          "angle": 0,
          "width": 8.9,
          "height": 18.08,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "4",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "16",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": -50,
          "top": 100,
          "angle": 0,
          "width": 8.9,
          "height": 18.08,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "1",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "16",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 63,
          "top": 100,
          "angle": 0,
          "width": 8.9,
          "height": 18.08,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "5",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "16",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 175,
          "top": 100,
          "angle": 0,
          "width": 8.9,
          "height": 18.08,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "6",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "16",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 290,
          "top": 100,
          "angle": 0,
          "width": 8.9,
          "height": 18.08,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "3",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "16",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 0,
          "top": 200,
          "angle": 0,
          "width": 709.38,
          "height": 114.72,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "The number below the box indicates the order in which you have to click on the words. \nIn the actual experiments, there will be no numbers, and you have to remember the order\nin which you saw the words and click on them in that order. \n\nPress SPACE to continue.",
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
          "width": 660.59,
          "height": 185.5,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "IMPORTANT!\n\nThe number of words on each list will vary. Importantly, there are two types of lists. \nOn the first type of list, you will have to remember all of the words on the list and\nreproduce them in their order.\n\nOn the second type of list, after one of the words you will see 3 red X symbols\nin the middle of the screen. For example like this:",
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
          "width": 64.03,
          "height": 36.16,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "#d6341a",
          "text": "XXX",
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
          "width": 667.81,
          "height": 91.12,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "#000000",
          "text": "This means that the words you have seen so far on this list won't be tested, and you\nonly need to remember the order of the words that appear after the XXX symbol.\n\nFor example, if you see the following sequence of words:",
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
          "width": 705.34,
          "height": 138.31,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "you don't need to remember the words TRUST and PAINTING, because they appeared\nbefore the XXX symbol. You will NOT know in advance whether the list will have\nthe XXX symbol in the middle, so do your best to remember all words from the begining. \nHowever, if you do see the XXX symbol, feel free to forget the words that came before it.\n\nPress SPACE to continue.",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": -239,
          "top": 110,
          "angle": 0,
          "width": 156.67,
          "height": 20.34,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "TRUST, PAINTING,",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": -135,
          "top": 110,
          "angle": 0,
          "width": 41.02,
          "height": 20.34,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "#d6341a",
          "text": "XXX,",
          "fontStyle": "normal",
          "fontWeight": "normal",
          "fontSize": "18",
          "fontFamily": "sans-serif",
          "lineHeight": 1.16,
          "textAlign": "center"
        },
        {
          "type": "i-text",
          "left": 125,
          "top": 110,
          "angle": 0,
          "width": 461.38,
          "height": 20.34,
          "stroke": null,
          "strokeWidth": 1,
          "fill": "black",
          "text": "CRUST, ASSISTANT, SHOW, MUESLI, MOUNTAIN, SUN",
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
funs.draw_text('+',0,0, '60px Arial');
funs.draw_text('(press SPACE to begin the next list)',0,50, '18px Arial');
Trial_counter++;
Stim_counter = 0;
Test_counter = 0;
window.responses = [];
}
            },
            "title": "Fixation",
            "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n\u003C\u002Fmain\u003E"
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
            "timeout": "${pars.blank_time}"
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
stim = pars.trial_words1[Trial_counter][Stim_counter]
funs.draw_text(stim,0,0, '60px Arial')
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
Stim_counter++

}
                  },
                  "title": "Stim",
                  "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n\u003C\u002Fmain\u003E",
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
                  "messageHandlers": {},
                  "title": "ISI",
                  "timeout": "${pars.isi}"
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
funs.draw_text('XXX',0,0, '90px Arial', 'red');
Stim_counter = 0;
}
            },
            "title": "ForgetMark",
            "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n\u003C\u002Fmain\u003E",
            "timeout": "${pars.forget_time}",
            "skip": "${pars.trial_type[Trial_counter] === \"first\"}",
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
stim = pars.trial_words2[Trial_counter][Stim_counter]
funs.draw_text(stim,0,0, '60px Arial')
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
Stim_counter++

}
                  },
                  "title": "Stim",
                  "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n\u003C\u002Fmain\u003E",
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
                  "messageHandlers": {},
                  "title": "ISI",
                  "timeout": "${pars.isi}"
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
funs.draw_text('???',0,0, '60px Arial');
if (pars.trial_type[Trial_counter] == "first") {
  pars.test_order = this.random.shuffle(pars.trial_words1[Trial_counter])
} else {
  pars.test_order = this.random.shuffle(pars.trial_words2[Trial_counter])
}



}
            },
            "title": "QuestionMark",
            "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n\u003C\u002Fmain\u003E",
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
                    "click #box1": "1",
                    "click #box2": "2",
                    "click #box3": "3",
                    "click #box4": "4",
                    "click #box5": "5",
                    "click #box6": "6"
                  },
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

current_set_size = pars.trial_type[Trial_counter] == "first" ? pars.set_size1[Trial_counter] : pars.set_size2;
for (i = 0; i < 6; i++) {
  let mid = current_set_size/2-0.5;
  let x = (i-mid)*150;
  if (i < current_set_size) {
    let stim = pars.test_order[i];
    console.log(i);
    if (Test_counter == 0 || !responses.includes(''+(i+1))) {
      console.log(responses.includes(''+i+1))
      funs.draw_box_div(i+1, x,0,140,100);
      funs.draw_text(stim, x, 0, '24px Arial');
    }
  }
}

$("#canvas").mousemove(function(event){ 
  let relX = event.pageX - $(this).offset().left - canvas.width/2;
  let relY = event.pageY - $(this).offset().top - canvas.height/2;
});
},
                    "end": function anonymous(
) {
window.responses.push(this.data.response)
correct_response = pars.trial_type[Trial_counter] == "first" ? pars.trial_words1[Trial_counter][Test_counter] : pars.trial_words2[Trial_counter][Test_counter];
this.data.correct_response = correct_response;
this.data.test_order = pars.test_order;
this.data.trial = Trial_counter+1;
this.data.response_position = Test_counter+1;
this.data.chosen_stim = pars.test_order[this.data.response-1]
let match = correct_response == pars.test_order[this.data.response-1];
this.data.acc = match ? 1 : 0;
this.data.setsize = pars.set_size1[Trial_counter];
this.data.trial_type = pars.trial_type[Trial_counter];
this.data.practice = 'practice';
Test_counter++;
}
                  },
                  "title": "Reconstruction",
                  "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E"
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
funs.draw_text('+',0,0, '60px Arial');
Trial_counter++;
Stim_counter = 0;
Test_counter = 0;
window.responses = [];
}
            },
            "title": "Fixation",
            "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n\u003C\u002Fmain\u003E"
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
            "timeout": "${pars.blank_time}"
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
stim = pars.trial_words1[Trial_counter][Stim_counter]
funs.draw_text(stim,0,0, '60px Arial')
},
                    "end": function anonymous(
) {
this.data.stim = stim;
this.data.input_position = Stim_counter+1;
this.data.trial = Trial_counter+1;
this.data.setsize = pars.set_size1[Trial_counter];
this.data.trial_type = pars.trial_type[Trial_counter];
this.data.trial_part = "first";
Stim_counter++

}
                  },
                  "title": "Stim",
                  "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n\u003C\u002Fmain\u003E",
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
                  "messageHandlers": {},
                  "title": "ISI",
                  "timeout": "${pars.isi}"
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
funs.draw_text('XXX',0,0, '90px Arial', 'red');
Stim_counter = 0;
}
            },
            "title": "ForgetMark",
            "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n\u003C\u002Fmain\u003E",
            "timeout": "${pars.forget_time}",
            "skip": "${pars.trial_type[Trial_counter] === \"first\"}",
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
stim = pars.trial_words2[Trial_counter][Stim_counter]
funs.draw_text(stim,0,0, '60px Arial')
},
                    "end": function anonymous(
) {
this.data.stim = stim;
this.data.input_position = Stim_counter+1;
this.data.trial = Trial_counter+1;
this.data.setsize1 = pars.set_size1[Trial_counter];
this.data.trial_type = pars.trial_type[Trial_counter];
this.data.trial_part = "second";
Stim_counter++

}
                  },
                  "title": "Stim",
                  "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n\u003C\u002Fmain\u003E",
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
                  "messageHandlers": {},
                  "title": "ISI",
                  "timeout": "${pars.isi}"
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
funs.draw_text('???',0,0, '60px Arial');
if (pars.trial_type[Trial_counter] == "first") {
  pars.test_order = this.random.shuffle(pars.trial_words1[Trial_counter])
} else {
  pars.test_order = this.random.shuffle(pars.trial_words2[Trial_counter])
}



}
            },
            "title": "QuestionMark",
            "content": "\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n\u003C\u002Fmain\u003E",
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
                    "click #box1": "1",
                    "click #box2": "2",
                    "click #box3": "3",
                    "click #box4": "4",
                    "click #box5": "5",
                    "click #box6": "6"
                  },
                  "parameters": {},
                  "messageHandlers": {
                    "run": function anonymous(
) {
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = pars.canvas_width;
canvas.height = pars.canvas_height;

current_set_size = pars.trial_type[Trial_counter] == "first" ? pars.set_size1[Trial_counter] : pars.set_size2;
for (i = 0; i < 6; i++) {
  let mid = current_set_size/2-0.5;
  let x = (i-mid)*150;
  if (i < current_set_size) {
    let stim = pars.test_order[i];
    console.log(i);
    if (Test_counter == 0 || !responses.includes(''+(i+1))) {
      console.log(responses.includes(''+i+1))
      funs.draw_box_div(i+1, x,0,140,100);
      funs.draw_text(stim, x, 0, '24px Arial');
    }
  }
}

$("#canvas").mousemove(function(event){ 
  let relX = event.pageX - $(this).offset().left - canvas.width/2;
  let relY = event.pageY - $(this).offset().top - canvas.height/2;
});
},
                    "end": function anonymous(
) {
window.responses.push(this.data.response)
correct_response = pars.trial_type[Trial_counter] == "first" ? pars.trial_words1[Trial_counter][Test_counter] : pars.trial_words2[Trial_counter][Test_counter];
this.data.correct_response = correct_response;
this.data.test_order = pars.test_order;
this.data.trial = Trial_counter+1;
this.data.response_position = Test_counter+1;
this.data.chosen_stim = pars.test_order[this.data.response-1]
let match = correct_response == pars.test_order[this.data.response-1];
let acc = match ? 1 : 0;
this.data.acc = acc;
this.data.setsize = pars.set_size1[Trial_counter];
this.data.trial_type = pars.trial_type[Trial_counter];
Overall_accuracy.push(acc);
Test_counter++;
}
                  },
                  "title": "Reconstruction",
                  "content": "\u003Cstyle\u003E\r\n  .response_box{\r\n    position: absolute;\r\n    border:1px solid black;\r\n  }\r\n\r\n  #canvas-wrap { position:relative }\r\n\u003C\u002Fstyle\u003E\r\n\r\n\u003Cmain class=\"content-horizontal-center content-vertical-center\"\u003E\r\n\u003Cdiv id=\"canvas-wrap\"\u003E\r\n  \u003Ccanvas  id=\"canvas\"\u003E\u003C\u002Fcanvas\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box1\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box2\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box3\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box4\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box5\"\u003E\u003C\u002Fdiv\u003E\r\n    \u003Cdiv class=\"response_box\" id=\"box6\"\u003E\u003C\u002Fdiv\u003E\r\n  \r\n\u003C\u002Fdiv\u003E\r\n\u003C\u002Fmain\u003E"
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
          "text": "You succesfully remembered ${window.acc_perc}% of the words!\n\nPress SPACE to go to the final questionaire before ending the experiment.",
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