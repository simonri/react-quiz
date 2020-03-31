"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractDataFromURL = exports.normalizeData = exports.monthIndex = void 0;

var _cheerio = _interopRequireDefault(require("cheerio"));

var monthIndex = function monthIndex(monthName) {
  switch (monthName) {
    case "January":
    case "Jan.":
      return "01";

    case "February":
    case "Feb.":
      return "02";

    case "March":
    case "Mar.":
      return "03";

    case "April":
    case "Apr.":
      return "04";

    case "May":
      return "05";

    case "June":
    case "Jun.":
      return "06";

    case "July":
    case "Jul.":
      return "07";

    case "August":
    case "Aug.":
      return "08";

    case "September":
    case "Sep.":
      return "09";

    case "October":
    case "Oct.":
      return "10";

    case "November":
    case "Nov.":
      return "11";

    case "December":
    case "Dec.":
      return "12";

    default:
      return "";
  }
};

exports.monthIndex = monthIndex;

var normalizeData = function normalizeData(elem) {
  var regex = /((As of|On|In|At|Dated|Effective)( |&nbsp)((January|Jan\.|February|Feb\.|March|Mar\.|April|Apr\.|May|June|Jun\.|July|Jul\.|August|Aug\.|September|Sep\.|October|Oct\.|November|Nov\.|December|Dec\.)( |&nbsp)(|(([0-9]{1,2}), )|.*)([0-9]{4}))(.+)(\.|;))/g;
  var result = regex.exec(elem);

  if (result) {
    var days = "00";
    if (result[9]) days = result[9].padStart(2, "0");
    return {
      i: result[10] + "-" + exports.monthIndex(result[5]) + "-" + days,
      val: elem
    };
  }

  return {
    i: "9999-99-99",
    val: ""
  };
};

exports.normalizeData = normalizeData;

var extractDataFromURL = function extractDataFromURL(data0) {
  // Normalize the <p> HTML tags (paragraph) to be seen each one in a single line.
  var data = /(<body[\s\S]*<\/body>)/gi.exec(data0);

  var $ = _cheerio["default"].load(data[0]);

  var dom = $("div");

  while (dom.parent().length) {
    dom = dom.parent();
  } //const dom = new JSDOM(data[1]);
  //$("#necessaryTemporaryTag").html(data[1]);


  if (dom.find("i").length) dom.find("i").each(function () {
    var text = "(((" + $(this).text() + ")))";
    $(this).html(text);
  });
  if (dom.find("img").length) dom.find("img").each(function () {
    // It could be better to remove the <img> tag to remove the errors from the browser's console since the files that are in the src are not found locally.
    $(this).attr("src", "");
  });
  if (dom.find("p").length) dom.find("p").each(function () {
    var text = $(this).text().replace(/\n/g, " ");
    $(this).html(text + "\n");
  });
  if (dom.find("div:not(:has(>div))").length) dom.find("div:not(:has(>div))").each(function () {
    var text = $(this).text().replace(/\n/g, " ");
    $(this).html(text + "\n");
  });
  if (dom.find("table").length) dom.find("table").each(function () {
    $(this).html("");
  });
  data = dom.text();
  data = data.split(" ").join(" "); // This is a trick to replace all occurence in JS. Please be careful, the first element is the 0xa0 character which is "&nbsp;" (Non-breaking space) that will be converted to a real white space
  //data=data.replaceAll(/[^\.](( )*\n)/g, function(_, $1) { return extra_data[$1]; })
  //data=data.split(/[^\.](( )*\n)/).join(" \n");
  // An array (a list) that contains all the extracted results

  var results = []; // The regular expression used for the extraction:
  //   "\." is the dot character. The "\" is used to escape the special character "." that has other usage.
  //   "( |&nbsp)" means that the results should contains the blank space " " or the HTML blank space "&nbsp" which is only visible in the HTML source code and it's interpreted by the web browser as a visible blank space.
  //   "(As of |On|In|Effective|Dated)" means that the results should contains one of these text "As of" or "On" or "In" or "Effective" or "Dated".
  //   "([^\.<>]*)" can be split into two parts "[^\.<>]" and "*". The first part "[^\.<>]" means that the results should not contains a dot (.) or any HTML tags that we can identify from these characters "<" or ">". So the results can contain any character except for a dot "." or "<" or ">". More technical details about this syntax, the "[^X]" means that the results should never contain any element from X (where X is a list of single characters). The second part is "*" which is always applied to the first part and which means "zero or more occurrences of preceding character". So this text is valid ". On December 2004, there was something." and also this text is valid ". On the last period of December 2004, there was something." thanks to this condition "([^\.<>]*)".
  //   "(January|Jan\.|February|Feb\.|March|Mar\.|April|Apr\.|May|June|Jun\.|July|Jul\.|August|Aug\.|September|Sep\.|October|Oct\.|November|Nov\.|December|Dec\.)" means that the results should contains one of these text "January" or "Jan." or "February" or "Feb." or "March" or "Mar." or "April" or "Apr." or "May" or "June" or "Jun." or "July". or "Jul." or "September" or "Sep." or "October" or "Oct." or "Nomvember" or "Nov." or "December" or "Dec."
  //   "([^<>]*)" means that the text can contain anything except for "<" or ">"
  //   "(\.|;))" means that the result should contains a dot "." or a ";".
  // To summarize what this regular expression search for: it search for a dot ".", then a blank space, then one of these text "As of" or "On" or "In", then search for any occurence that does not contain "." or "<" or ">" multiple time and then search for the month names "January" or "Jan." until "December" or "Dec.", then search again for any occurence that does not contain "." or "<" or ">" multiple time until and finally meet a dot "." or a ";" character.
  // You can refer to https://regex101.com/ to test some regular expressions against any text ("Test strings").

  var rx = /((As of|On|In|At|Dated|Effective)( |&nbsp)(January|Jan\.|February|Feb\.|March|Mar\.|April|Apr\.|May|June|Jun\.|July|Jul\.|August|Aug\.|September|Sep\.|October|Oct\.|November|Nov\.|December|Dec\.)( |&nbsp)(.+)[0-9]{4}(.+)(\.|;))/g; // An array (a list) that will contains a temporar result of the extraction. But why using 2 variables "results" and "extraction" ? I'm gonna explain that next

  var extraction; // Whitelist these elements with the dot character. Example "In November 2004, FASB issued SFAS No. 151, Inventory Costs." So the phrase will not be cut on "In November 2004, FASB issued SFAS No.".

  var canEndsWith = ["No", "Corp", "Inc", "Mr", "Mrs", "Ms"]; // To extract the wanted data from the source code, we need to use the predefined regular expression extraction function "exec()". And since this function returns only a single result, we need to repeat this operation a lot of time using a loop function "while()" until the "exec()" function can't find any other result. That's why we need the variable "results" that will contains all the results that we extracted from every iteration in the "while()" loop.
  // "rx" is the regular expression that will be used for extraction and "data" contains the HTML source code that will be used to extract the data from it.
  // You should always set the exec() result in an array because using multiple exec() like in this project, will reset the previous exec() parse.

  var extractions = [];

  while (extraction = rx.exec(data)) {
    extractions.push(extraction);
  }

  for (var _i = 0, _extractions = extractions; _i < _extractions.length; _i++) {
    var _extraction = _extractions[_i];
    // As we said, the variable "extraction" contains a single result but this variable does not contains exactly a text value of this result. As you noticed in the regular expression, there are some Parentheses "(" and ")" characters. These characters are used for grouping and capturing every part of a single result. Let's take an example: "Hi. On the last period of December 2004, there was a lot of thing. That's all".
    // The first element "extraction[0]" will contain ". On the last period of December 2004, there was a lot of thing.". The first element always contains all the captured element that has been found
    // The second element "extraction[1]" will contain " ". Becasue of "( |&nbsp)".
    // The third element "extraction[2]" will contain "On the last period of December 2004, there was a lot of thing.".
    // The fourth element "extraction[3]" will contain "On". Did you remember the "(As of |On|In)" part in the regular expression ?
    // The fifth element "extraction[4]" will contain " ".
    // And so on. The only intresting part is the second element "extraction[2]" which is delimited by the biggest parentheses in the regular expression.
    var extractedData = _extraction[1]; // This variable contains the final result that will be built from "extractedData".

    var filteredData = ""; // Since the default value of "extractedData" is too long (too many phrases each one ends by a dot "."), we will filter the "extractedData" variable by splitting it using "." delimiter and then we will think about adding only necessary parts (phrases) to the "filteredData" variable.

    var splitted = extractedData.split(".");
    var newSplitted = splitted;
    var nextNewSplitted = true;

    while (nextNewSplitted) {
      nextNewSplitted = false;
      splitted = newSplitted; // If "splitted" is not an empty list

      if (splitted.length > 0) {
        // Used when a name was mentioned inside <i> HTML tags included in the <p> HTML tags. So, to make sure that the full name was extracted, we already converted the <i> HTML tag to a triple parentheses "(((this is a name)))" so if if find in a splitted[] element "(((", we should make sure to find the second part ")))" in the same part of in the next parts.
        var continueUntilClosingTheQuote = false;
        var followedQuotes = ""; // For every part of "splitted"

        for (var i = 0; i < splitted.length; i++) {
          // For every part of "splitted" as "splittedElement" variable
          var splittedElement = splitted[i];
          followedQuotes = splittedElement; // If the "splittedElement" variable is not an empty text

          if (splittedElement) {
            // We add the "splittedElement" variable to the "filteredData" variable. This is always done for the the first element of the "splitted" list.
            filteredData = filteredData + splittedElement + "."; // Now the intresting part, we will use the "whitelistedTextFound" variable to check if we have done with adding "splittedElement" to the "filteredData" variable or we will continue that on the next loop iteration

            var whitelistedTextFound = false; // For every whitelisted text in the "canEndsWith" list

            for (var j = 0; j < canEndsWith.length; j++) {
              // A single element from the "canEndsWith" list
              var canEndsWithElement = canEndsWith[j]; // If the current part (splittedElement) ends with this whitelisted text, this means that the phrase does not stop here so we have to continue adding "splittedElement" to the "filteredData" variable

              if (splittedElement.endsWith(canEndsWithElement)) {
                whitelistedTextFound = true;
              }
            } // Another problem can be found with this example "In December 2004, there was 95.5% of success." and exactly for the dot that we can find in the 95.5 that should also be whitelisted. And at the same time, we will also whitelist any text like this "On September 27, 2004, the assets of Shandong Neo-Luck (with an appraised valued of RMB52,886  on a force-sale basis) were auctioned by way of public auction by Weifang Jing Cheng Auction Co., Ltd to Beijing Baorui Guarantee Co., Ltd (“Beijing Baorui”) for RMB33,848  (the “First Auction”).
            // Where there was a comma "," in front of a dot "." which means that the phrase should not ends with a ".," so we whitelist it also.
            // Using this regular expression: /^([0-9]|\,|[a-z]|#)+/g
            // Actually there are a lot of conditions that this regular expression lacks, so we can use a better regular expression which can solve a lot of search problems which is to exclude the white space after the dot. For example "U.S." or if there was a space, then the first meet character should not an upper case


            var whitelistRegexStart = /^([^ ]| [^A-Z])/g;

            if (i + 1 in splitted && splitted[i + 1] && whitelistRegexStart.test(splitted[i + 1])) {
              whitelistedTextFound = true;
            } // Since there are a lot example where the previous condition is not sufficient like "On July 22, 2019, our Hungarian subsidiary entered into a non-prosecution agreement (“NPA”) with the U.S. Department of Justice (“DOJ”) and we agreed to..."
            // We will focus on the last word in the current split to check if this word was an uppercase word to continue to the next iteration without breaking the loop


            var splittedSplittedElement = splittedElement.split(/( |&nbsp)/);
            var whitelistRegexStartUppercase = /^([A-Z])/g; // If you want to troubleshoot this part, you should never try to console.log() the test() function becasue it will be successful for the first time and it will fail the next time since there is only one occurence

            if (splittedSplittedElement && splittedSplittedElement.length > 0 && whitelistRegexStartUppercase.test(splittedSplittedElement[splittedSplittedElement.length - 1])) {
              whitelistedTextFound = true;
            } // But if the next phrase starts with In/On/..., we should stop the phrase here.


            var whilelistNewPhrase = /^ (As of|On|In|At|Dated|Effective) /g;
            if (i + 1 in splitted && splitted[i + 1] && whilelistNewPhrase.exec(splitted[i + 1])) whitelistedTextFound = false; // If the last character is a closing parentheses like "in the US (United State)." then, the phrase should stop there.

            if (splittedElement[splittedElement.length - 1] === ")") whitelistedTextFound = false; // Searching for quotes
            // We suppose we found multiple indexes the first time to access the while loop and then we will check if that's correct there to know if we will continue looping or we will exit the loop.

            var multipleIndexesFound = true;

            while (multipleIndexesFound) {
              var quotesStartPosition = followedQuotes.indexOf("(((");
              var quotesEndPosition = followedQuotes.indexOf(")))");

              if (quotesStartPosition >= 0 && quotesEndPosition < 0) {
                continueUntilClosingTheQuote = true;
                multipleIndexesFound = false;
              } else if (quotesStartPosition < 0 && quotesEndPosition >= 0) {
                continueUntilClosingTheQuote = false;
                multipleIndexesFound = false; // Having multiple quotes (parentheses) like "...(((...)))..." or "...)))...(((..." in the same splittedElement can't give us an information about if we should continue searching for the splittedElement in which the quotes will be closed or this current splittedElement contains the closed quotes, so we should to parse the current splittedElement until getting a clear image or what's the last used quote (a closing quote or an opening quote). This search is done inside the parent "while(multipleIndexesFound){}"
              } else if (quotesStartPosition >= 0 && quotesEndPosition >= 0) {
                multipleIndexesFound = true;

                if (quotesStartPosition < quotesEndPosition) {
                  var followedQuotesArray = followedQuotes.split("(((");
                  var shifted = followedQuotesArray.shift();
                  followedQuotes = shifted + followedQuotesArray.join("(((");
                } else {
                  var _followedQuotesArray = followedQuotes.split(")))");

                  var _shifted = _followedQuotesArray.shift();

                  followedQuotes = _shifted + _followedQuotesArray.join(")))");
                }
              } else multipleIndexesFound = false;
            } // If the last word (using a blank space separator) in the current splittedElement is a single character (it can't happen in the end of a phrase), then we continue the merging


            if (splittedSplittedElement && splittedSplittedElement.length > 0 && splittedSplittedElement[splittedSplittedElement.length - 1].length === 1) {
              whitelistedTextFound = true;
            }

            if (whitelistedTextFound === false && continueUntilClosingTheQuote === false) {
              if (i + 1 in splitted) {
                var newSplitted0 = splitted.slice(i + 1);
                var newExtraction = rx.exec(newSplitted0.join("."));

                if (newExtraction) {
                  nextNewSplitted = true;
                  newSplitted = newExtraction[1].split(".");
                }
              }

              break;
            }
          }
        }
      } // "push()" is a function that is used against an array (a list) to push an element to this list.


      if (results.includes(filteredData)) results.push(filteredData.split("(((").join("").split(")))").join(""));

      if (nextNewSplitted) {
        filteredData = "";
      }
    }
  }

  var normalizedData = results.map(exports.normalizeData).filter(function (e) {
    return e.val !== "";
  });
  var sortedNormalizedData = normalizedData.sort(function (a, b) {
    return a.i === b.i ? 0 : a.i < b.i ? -1 : 1;
  });
  return sortedNormalizedData; //.map(function(e){return e["val"];}).join("<br>");
};

exports.extractDataFromURL = extractDataFromURL;