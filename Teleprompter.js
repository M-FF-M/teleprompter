
function rgbToLum(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

function arrToColor(r, g, b, a) {
  if (typeof a !== 'undefined')
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  return `rgb(${r}, ${g}, ${b})`;
}

function classSet(className, properties, propval) {
  const elems = document.getElementsByClassName(className);
  for (let i = 0; i < elems.length; i++) {
    if (typeof propval === 'string')
      elems[i].style[properties] = propval;
    else {
      for (prop in properties) {
        if (properties.hasOwnProperty(prop))
          elems[i].style[prop] = properties[prop];
      }
    }
  }
}

function max(a, b) {
  return a > b ? a : b;
}

function min(a, b) {
  return a > b ? b : a;
}

function simplify(word) {
  word = word.toLowerCase();
  word = word.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  word = word.replace(/é/g, 'e').replace(/è/g, 'e').replace(/ê/g, 'e').replace(/á/g, 'a');
  word = word.replace(/à/g, 'a').replace(/â/g, 'a').replace(/ô/g, 'o').replace(/î/g, 'i');
  word = word.replace(/ù/g, 'u').replace(/û/g, 'u').replace(/ë/g, 'e').replace(/ï/g, 'i');
  word = word.replace(/ç/g, 'c').replace(/œ/g, 'oe').replace(/æ/g, 'ae');
  return word;
}

function escapeHtml(word) {
  return word.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;').replace(/ /g, '&nbsp;')
    .replace(/\r?\n/g, '&#8203;<br />&#8203;');
}

class Teleprompter {
  constructor() {
    this.text = `Wikipedia (abbreviated as WP) is a multilingual online encyclopedia. The website
was created and is maintained as an open collaboration project by a community of volunteer
editors, using a wiki-based editing system. It is the largest and most popular general reference
work on the World Wide Web. It is also one of the 20 most popular websites ranked by Alexa, as
of March 2020. It features exclusively free content and no commercial ads and is owned and
supported by the Wikimedia Foundation, a non-profit organization funded primarily through
donations.

Wikipedia was launched on January 15, 2001, and was created by Jimmy Wales and Larry Sanger.
Sanger coined its name as a portmanteau of the words "wiki" (Hawaiian for "quick") and
"encyclopedia". Initially an English-language encyclopedia, versions of Wikipedia in other
languages were quickly developed. With 6.1 million articles, the English Wikipedia is the
largest of the more than 300 Wikipedia encyclopedias. Overall, Wikipedia comprises more than
53 million articles attracting 1.5 billion unique visitors per month.

In 2005, Nature published a peer review comparing 42 hard science articles from Encyclopædia
Britannica and Wikipedia and found that Wikipedia's level of accuracy approached that of
Britannica, although critics suggested that it might not have fared so well in a similar study
of a random sampling of all articles or one focused on social science or contentious social
issues. The following year, Time magazine stated that the open-door policy of allowing anyone to
edit had made Wikipedia the biggest and possibly the best encyclopedia in the world, and was a
testament to the vision of Jimmy Wales.`.replace(/([^\r\n])\r?\n([^\r\n])/gm, '$1 $2');
    document.getElementById('text_editor').value = this.text;
    this.adaptText();
    this.msgCounter = 0;
    this.colorWarn = true;
    this.colorWarnIdx = -1;
    this.play = false;
    this.edit = false;
    this.settings = ['play', 'restart', 'edit', 'lang', 'bg', 'fg', 'size', 'font', 'margin', 'mirrorv', 'mirrorh', 'clear'];
    this.langValues =
      [ ['Afrikaans',       ['af-ZA']],
        ['አማርኛ',           ['am-ET']],
        ['Azərbaycanca',    ['az-AZ']],
        ['বাংলা',            ['bn-BD', 'বাংলাদেশ'],
                            ['bn-IN', 'ভারত']],
        ['Bahasa Indonesia',['id-ID']],
        ['Bahasa Melayu',   ['ms-MY']],
        ['Català',          ['ca-ES']],
        ['Čeština',         ['cs-CZ']],
        ['Dansk',           ['da-DK']],
        ['Deutsch',         ['de-DE']],
        ['English',         ['en-AU', 'Australia'],
                            ['en-CA', 'Canada'],
                            ['en-IN', 'India'],
                            ['en-KE', 'Kenya'],
                            ['en-TZ', 'Tanzania'],
                            ['en-GH', 'Ghana'],
                            ['en-NZ', 'New Zealand'],
                            ['en-NG', 'Nigeria'],
                            ['en-ZA', 'South Africa'],
                            ['en-PH', 'Philippines'],
                            ['en-GB', 'United Kingdom'],
                            ['en-US', 'United States']],
        ['Español',         ['es-AR', 'Argentina'],
                            ['es-BO', 'Bolivia'],
                            ['es-CL', 'Chile'],
                            ['es-CO', 'Colombia'],
                            ['es-CR', 'Costa Rica'],
                            ['es-EC', 'Ecuador'],
                            ['es-SV', 'El Salvador'],
                            ['es-ES', 'España'],
                            ['es-US', 'Estados Unidos'],
                            ['es-GT', 'Guatemala'],
                            ['es-HN', 'Honduras'],
                            ['es-MX', 'México'],
                            ['es-NI', 'Nicaragua'],
                            ['es-PA', 'Panamá'],
                            ['es-PY', 'Paraguay'],
                            ['es-PE', 'Perú'],
                            ['es-PR', 'Puerto Rico'],
                            ['es-DO', 'República Dominicana'],
                            ['es-UY', 'Uruguay'],
                            ['es-VE', 'Venezuela']],
        ['Euskara',         ['eu-ES']],
        ['Filipino',        ['fil-PH']],
        ['Français',        ['fr-FR']],
        ['Basa Jawa',       ['jv-ID']],
        ['Galego',          ['gl-ES']],
        ['ગુજરાતી',           ['gu-IN']],
        ['Hrvatski',        ['hr-HR']],
        ['IsiZulu',         ['zu-ZA']],
        ['Íslenska',        ['is-IS']],
        ['Italiano',        ['it-IT', 'Italia'],
                            ['it-CH', 'Svizzera']],
        ['ಕನ್ನಡ',           ['kn-IN']],
        ['ភាសាខ្មែរ',          ['km-KH']],
        ['Latviešu',        ['lv-LV']],
        ['Lietuvių',        ['lt-LT']],
        ['മലയാളം',        ['ml-IN']],
        ['मराठी',            ['mr-IN']],
        ['Magyar',          ['hu-HU']],
        ['ລາວ',             ['lo-LA']],
        ['Nederlands',      ['nl-NL']],
        ['नेपाली भाषा',        ['ne-NP']],
        ['Norsk bokmål',    ['nb-NO']],
        ['Polski',          ['pl-PL']],
        ['Português',       ['pt-BR', 'Brasil'],
                            ['pt-PT', 'Portugal']],
        ['Română',          ['ro-RO']],
        ['සිංහල',           ['si-LK']],
        ['Slovenščina',     ['sl-SI']],
        ['Basa Sunda',      ['su-ID']],
        ['Slovenčina',      ['sk-SK']],
        ['Suomi',           ['fi-FI']],
        ['Svenska',         ['sv-SE']],
        ['Kiswahili',       ['sw-TZ', 'Tanzania'],
                            ['sw-KE', 'Kenya']],
        ['ქართული',        ['ka-GE']],
        ['Հայերեն',          ['hy-AM']],
        ['தமிழ்',           ['ta-IN', 'இந்தியா'],
                            ['ta-SG', 'சிங்கப்பூர்'],
                            ['ta-LK', 'இலங்கை'],
                            ['ta-MY', 'மலேசியா']],
        ['తెలుగు',           ['te-IN']],
        ['Tiếng Việt',      ['vi-VN']],
        ['Türkçe',          ['tr-TR']],
        ['اُردُو',              ['ur-PK', 'پاکستان'],
                            ['ur-IN', 'بھارت']],
        ['Ελληνικά',        ['el-GR']],
        ['български',       ['bg-BG']],
        ['Pусский',         ['ru-RU']],
        ['Српски',          ['sr-RS']],
        ['Українська',      ['uk-UA']],
        ['한국어',           ['ko-KR']],
        ['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
                            ['cmn-Hans-HK', '普通话 (香港)'],
                            ['cmn-Hant-TW', '中文 (台灣)'],
                            ['yue-Hant-HK', '粵語 (香港)']],
        ['日本語',           ['ja-JP']],
        ['हिन्दी',             ['hi-IN']],
        ['ภาษาไทย',         ['th-TH']]];
    this.panelOpened = 0;
    this.toDefaultSettings();
    this.applySettings();
    this.speechRec = null;
    document.getElementById('settings_container').addEventListener('mousemove', () => this.showPanel());
    for (let i = 0; i < this.settings.length; i++) {
      document.getElementById(`s_${this.settings[i]}`).addEventListener('click', () => this.settingsClick(this.settings[i]));
    }
    document.getElementById('disable_block').addEventListener('click', () => this.editFinishedClick());
  }

  adaptText() {
    const regex = /[\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\xd7\xf7]+/gm;
    this.recText = [];
    this.splitText = [];
    let match;
    let idx = 0;
    while ((match = regex.exec(this.text)) !== null) {
      if (match.index > idx) {
        const word = this.text.substring(idx, match.index);
        this.recText.push({ idx: this.splitText.length, word: simplify(word) })
        this.splitText.push(word);
      }
      this.splitText.push(match[0]);
      idx = match.index + match[0].length;
    }
    if (this.text.length > idx) {
      const word = this.text.substring(idx, this.text.length);
      this.recText.push({ idx: this.splitText.length, word: simplify(word) })
      this.splitText.push(word);
    }
    let playText = '';
    idx = 0;
    let recText2 = [...this.recText];
    if (recText2[recText2.length - 1].idx != this.splitText.length - 1)
      recText2.push({ idx: this.splitText.length - 1 });
    this.numWordSpans = recText2.length;
    for (let i = 0; i < this.numWordSpans; i++) {
      playText += `<span id="word_${i}">`;
      for (; idx <= (i + 1 < recText2.length ? recText2[i + 1].idx - 1 : recText2[i].idx); idx++)
        playText += escapeHtml(this.splitText[idx]);
      playText += '</span>&#8203;';
    }
    document.getElementById('play_text').innerHTML = playText;
    for (let i = 0; i < this.numWordSpans; i++)
      document.getElementById(`word_${i}`).addEventListener('click', () => this.wordClick(i));
    this.currentPosition = 0;
  }

  settingsClick(setting) {
    if (setting == 'play') {
      if (!this.edit) {
        if (this.play) this.pause();
        else this.start();
      }
      this.applySettings();
    } else if (setting == 'restart') {
      this.stop();
      this.applySettings();
    } else if (setting == 'edit') {
      this.stop();
      if (this.edit) {
        this.text = document.getElementById('text_editor').value;
        this.adaptText();
        this.edit = false;
      } else
        this.edit = true;
      this.applySettings();
    } else if (setting == 'clear') {
      this.toFactorySettings();
      this.applySettings();
    } else if (typeof this[setting] === 'boolean') {
      this[setting] = !this[setting];
      this.applySettings();
    } else if (typeof this[setting] === 'number' || typeof this[setting] === 'string' || typeof this[setting] === 'object') {
      const position = document.getElementById(`s_${setting}`).getBoundingClientRect();
      let editElement = '';
      if (setting == 'lang') {
        editElement += `<select id="editor_${setting}">`;
        for (let i = 0; i < this.langValues.length; i++) {
          let sel = '';
          for (let k = 1; k < this.langValues[i].length; k++) {
            if (this.langValues[i][k][0] == this.lang) {
              sel = ' selected';
              break;
            }
          }
          editElement += `<option value="${i}"${sel}>${this.langValues[i][0]}</option>`;
        }
        editElement += `</select><span id="editor_${setting}_refine"></span>`;
      } else if (typeof this[setting] === 'number') {
        editElement += `<input type="number" id="editor_${setting}" value="${this[setting]}" />`;
      } else if (typeof this[setting] === 'string') {
        editElement += `<input type="text" id="editor_${setting}" value="${this[setting]}" />`;
      } else if (typeof this[setting] === 'object') {
        editElement += `<input type="text" id="editor_${setting}" value="${this[setting].join(', ')}" />`;
      }
      const newDiv = document.createElement('div');
      newDiv.setAttribute('id', 'editor_div');
      newDiv.style.zIndex = '21';
      newDiv.style.position = 'fixed';
      newDiv.style.left = `${position.left}px`;
      newDiv.style.top = `${position.top}px`;
      newDiv.innerHTML = `<div id="edit_s_${setting}" class="s_item s_edit"><div class="s_flex">
        <div class="s_icon" id="edit_s_${setting}_icon">
          <img src="icons/${setting}-${rgbToLum(...this.bg) < 0.5 ? 'white' : 'black'}.svg" class="s_img" id="edit_s_${setting}_img" />
        </div>${editElement}
      </div></div>`;
      document.body.appendChild(newDiv);
      document.getElementById('disable_block').style.display = 'block';
      document.getElementById(`editor_${setting}`).addEventListener('change', () => this.editChange(setting));
      if (setting == 'lang')
        this.adaptLanguageSelector();
    }
  }

  wordClick(numWord) {
    if (this.play) {
      this.currentPosition = min(numWord, this.recText.length);
      this.applySettings();
    }
  }

  start() {
    if (this.speechRec !== null) this.speechRec.stop();
    this.play = true;
    this.speechRec = new SpeechRecognizer((a, b, c) => this.speechResult(a, b, c));
    this.speechRec.start();
  }

  stop() {
    if (this.speechRec !== null) this.speechRec.stop();
    this.play = false;
    this.currentPosition = 0;
  }

  pause() {
    if (this.speechRec !== null) this.speechRec.stop();
    this.play = false;
  }

  speechResult(type, finalRes, interimRes) {
    if (type == 'error') {
      this.addMessage('error', interimRes);
      if (this.speechRec !== null) this.speechRec.stop();
      this.applySettings();
    }
  }

  adaptLanguageSelector() {
    let needSecondSel = -1;
    for (let i = 0; i < this.langValues.length; i++) {
      for (let k = 1; k < this.langValues[i].length; k++) {
        if (this.langValues[i][k][0] == this.lang) {
          if (this.langValues[i].length > 2)
            needSecondSel = i;
          break;
        }
      }
    }
    if (needSecondSel == -1) {
      document.getElementById('editor_lang_refine').innerHTML = '';
    } else {
      let editElement = '';
      editElement += `<select id="editorref_lang">`;
      for (let k = 1; k < this.langValues[needSecondSel].length; k++) {
        let sel = '';
        if (this.langValues[needSecondSel][k][0] == this.lang) sel = ' selected';
        editElement += `<option value="${k}"${sel}>${this.langValues[needSecondSel][k][1]}</option>`;
      }
      editElement += `</select>`;
      document.getElementById('editor_lang_refine').innerHTML = editElement;
      document.getElementById('editorref_lang').addEventListener('change', () => this.editChange('lang'));
    }
  }

  editChange(setting) {
    if (setting == 'lang') {
      const primaryIdx = parseInt(document.getElementById(`editor_${setting}`).value);
      let secondaryIdx = 1;
      if (typeof document.getElementById(`editorref_${setting}`) === 'object' && document.getElementById(`editorref_${setting}`) !== null)
        secondaryIdx = parseInt(document.getElementById(`editorref_${setting}`).value);
      secondaryIdx = min(this.langValues[primaryIdx].length - 1, secondaryIdx);
      this.lang = this.langValues[primaryIdx][secondaryIdx][0];
      this.adaptLanguageSelector();
    } else if (typeof this[setting] === 'number') {
      let value = parseInt(document.getElementById(`editor_${setting}`).value);
      if (isNaN(value)) value = 1; if (value < 1) value = 1;
      this[setting] = value;
      document.getElementById(`editor_${setting}`).value = value;
    } else if (typeof this[setting] === 'string') {
      this[setting] = document.getElementById(`editor_${setting}`).value;
    } else if (typeof this[setting] === 'object') {
      let value = [0, 0, 0];
      if (document.getElementById(`editor_${setting}`).value.search(/^ *([0-9]+), *([0-9]+), *([0-9]+) *$/) != -1) {
        const match = document.getElementById(`editor_${setting}`).value.match(/^ *([0-9]+), *([0-9]+), *([0-9]+) *$/);
        let r = parseInt(match[1]); let g = parseInt(match[2]); let b = parseInt(match[3]);
        if (isNaN(r)) r = 0; if (r < 0) r = 0; if (r > 255) r = 255;
        if (isNaN(g)) g = 0; if (g < 0) g = 0; if (g > 255) g = 255;
        if (isNaN(b)) b = 0; if (b < 0) b = 0; if (b > 255) b = 255;
        value = [r, g, b];
      }
      this.colorWarn = true;
      this[setting] = value;
      document.getElementById(`editor_${setting}`).value = value.join(', ');
    }
    if (this.font[0] != "'" && this.font.search(/ /g) != -1)
      this.font = `'${this.font}'`;
    if (this.size < 16) this.size = 16;
    if (this.size > 500) this.size = 500;
    if (this.margin > 1000) this.margin = 1000;
  }

  editFinishedClick() {
    document.body.removeChild(document.getElementById('editor_div'));
    document.getElementById('disable_block').style.display = 'none';
    this.applySettings();
  }

  toFactorySettings() {
    this.lang = 'en-US';
    this.bg = [64, 64, 64];
    this.fg = [242, 242, 242];
    this.size = 120;
    this.font = 'Arial';
    this.margin = 100;
    this.mirrorv = false;
    this.mirrorh = false;
  }

  toDefaultSettings() {
    this.toFactorySettings();
    if (localStorage.getItem('lang') !== null)
      this.lang = JSON.parse(localStorage.getItem('lang'));
    if (localStorage.getItem('bg') !== null)
      this.bg = JSON.parse(localStorage.getItem('bg'));
    if (localStorage.getItem('fg') !== null)
      this.fg = JSON.parse(localStorage.getItem('fg'));
    if (localStorage.getItem('size') !== null)
      this.size = JSON.parse(localStorage.getItem('size'));
    if (localStorage.getItem('font') !== null)
      this.font = JSON.parse(localStorage.getItem('font'));
    if (localStorage.getItem('margin') !== null)
      this.margin = JSON.parse(localStorage.getItem('margin'));
    if (localStorage.getItem('mirrorv') !== null)
      this.mirrorv = JSON.parse(localStorage.getItem('mirrorv'));
    if (localStorage.getItem('mirrorh') !== null)
      this.mirrorh = JSON.parse(localStorage.getItem('mirrorh'));
  }

  applySettings() {
    localStorage.setItem('lang', JSON.stringify(this.lang));
    localStorage.setItem('bg', JSON.stringify(this.bg));
    localStorage.setItem('fg', JSON.stringify(this.fg));
    localStorage.setItem('size', JSON.stringify(this.size));
    localStorage.setItem('font', JSON.stringify(this.font));
    localStorage.setItem('margin', JSON.stringify(this.margin));
    localStorage.setItem('mirrorv', JSON.stringify(this.mirrorv));
    localStorage.setItem('mirrorh', JSON.stringify(this.mirrorh));
    const bgDark = rgbToLum(...this.bg) < 0.5;
    const fgDark = rgbToLum(...this.fg) < 0.5;
    if (this.colorWarn) {
      if (bgDark && fgDark) {
        this.removeColorWarning();
        this.colorWarnIdx = this.addMessage('warning', 'Both text and background color are quite dark. Consider using a higher contrast.');
        this.colorWarn = false;
      }
      if (!bgDark && !fgDark) {
        this.removeColorWarning();
        this.colorWarnIdx = this.addMessage('warning', 'Both text and background color are quite bright. Consider using a higher contrast.');
        this.colorWarn = false;
      }
    }
    if ((bgDark && !fgDark) || (!bgDark && fgDark)) this.removeColorWarning();
    const iconDefault = bgDark ? 'white' : 'black';
    const iconAlternative = bgDark ? 'black' : 'white';
    document.getElementById('settings_container').style.color = iconDefault;
    for (let i = 0; i < this.settings.length; i++) {
      let icon = this.settings[i]; let color = iconDefault;
      if (this.settings[i] == 'play') {
        if (this.play) {
          icon = 'pause';
          document.getElementById('s_play_text').innerHTML = 'Pause';
        } else
          document.getElementById('s_play_text').innerHTML = 'Start';
      }
      if (typeof this[this.settings[i]] === 'boolean') {
        if (this[this.settings[i]]) {
          color = iconAlternative;
          document.getElementById(`s_${this.settings[i]}_icon`).style.backgroundColor = iconDefault;
        } else
          document.getElementById(`s_${this.settings[i]}_icon`).style.backgroundColor = 'transparent';
      }
      document.getElementById(`s_${this.settings[i]}_img`).src = `icons/${icon}-${color}.svg`;
    }
    if (this.mirrorv && this.mirrorh)
      document.getElementById('play_div').style.transform = 'scale(-1, -1)';
    else if (this.mirrorv)
      document.getElementById('play_div').style.transform = 'scale(1, -1)';
    else if (this.mirrorh)
      document.getElementById('play_div').style.transform = 'scale(-1, 1)';
    else
      document.getElementById('play_div').style.transform = 'none';
    document.body.style.backgroundColor = arrToColor(...this.bg);
    document.getElementById('settings_container').style.backgroundColor = arrToColor(...this.bg, 0.8);
    document.getElementById('disable_block').style.backgroundColor = arrToColor(...this.bg, 0.8);
    document.body.style.fontFamily = this.font;
    document.getElementById('play_text').style.color = arrToColor(...this.fg);
    for (let i = 0; i < this.numWordSpans; i++) {
      if (this.play) {
        const d = i - this.currentPosition;
        if (d <= 10)
          document.getElementById(`word_${i}`).style.fontSize = `${this.size}px`;
        else
          document.getElementById(`word_${i}`).style.fontSize = `${Math.round(this.size * (0.4 + 0.6 * Math.exp(-0.1 * (d - 10))))}px`;
        if (this.currentPosition <= i)
          document.getElementById(`word_${i}`).style.opacity = '1';
        else
          document.getElementById(`word_${i}`).style.opacity = '0.3';
      } else {
        document.getElementById(`word_${i}`).style.fontSize = `${this.size}px`;
        document.getElementById(`word_${i}`).style.opacity = '1';
      }
    }
    document.getElementById('play_div').style.paddingLeft = `${this.margin}px`;
    document.getElementById('play_div').style.paddingRight = `${this.margin}px`;
    document.getElementById('edit_text_div').style.paddingLeft = `${this.margin}px`;
    document.getElementById('edit_text_div').style.paddingRight = `${this.margin}px`;
    if (this.edit) {
      document.getElementById('play_div').style.display = 'none';
      document.getElementById('edit_text_div').style.display = 'block';
    } else {
      document.getElementById('play_div').style.display = 'block';
      document.getElementById('edit_text_div').style.display = 'none';
      if (this.play) {
        let scrollToElem = document.getElementById(`word_${this.currentPosition}`);
        let top = scrollToElem.getBoundingClientRect().top;
        let i = this.currentPosition;
        while (++i < this.numWordSpans) {
          scrollToElem = document.getElementById(`word_${i}`);
          if (Math.abs(scrollToElem.getBoundingClientRect().top - top) >= this.size)
            break;
        }
        scrollToElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  removeColorWarning() {
    if (this.colorWarnIdx != -1) {
      this.hideMessage(this.colorWarnIdx);
      this.colorWarnIdx = -1;
    }
  }

  showPanel(timeout = 3000) {
    document.getElementById('settings_container').style.maxWidth = '15.1em';
    this.panelOpened = max((new Date()).getTime() + timeout - 3000, this.panelOpened);
    window.setTimeout(() => this.hidePanel(), timeout + 100);
  }

  hidePanel() {
    if ((new Date()).getTime() - this.panelOpened > 3000) {
      document.getElementById('settings_container').style.maxWidth = '2.3em';
    }
  }

  addMessage(type, content) {
    const hideFct = (function (msgId, thisVal) {
      return () => thisVal.hideMessage(msgId);
    })(this.msgCounter, this);
    const newMsg = document.createElement('div');
    newMsg.setAttribute('id', `msg-${this.msgCounter}`);
    newMsg.setAttribute('class', type);
    newMsg.innerHTML = `<div class="s_flex">
      <div class="s_icon"><img src="icons/${type}-white.svg" class="s_img" /></div><span class="s_msg">${content}</span>
    </div>`;
    document.getElementById('messages').appendChild(newMsg);
    this.showPanel(10000);
    window.setTimeout(hideFct, 60000);
    return this.msgCounter++;
  }

  hideMessage(id) {
    try {
      const msg = document.getElementById(`msg-${id}`);
      const par = msg.parentElement;
      par.removeChild(msg);
    } catch (e) {}
  }
}