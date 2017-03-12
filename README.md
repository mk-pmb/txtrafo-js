
<!--#echo json="package.json" key="name" underline="=" -->
txtrafo
=======
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Easily apply other module&#39;s string transform functions to stdio and text
files.
<!--/#echo -->


Usage
-----

from [test/2nd-letter.js](test/2nd-letter.js):

<!--#include file="test/2nd-letter.js" start=""
  outdent="" code="javascript" -->
<!--#verbatim lncnt="7" -->
```javascript
require('txtrafo')({
  sourceFilename: module.filename,
  trafoFunc: function (text) { return text.replace(/\w(\w)\w*/g, '$1'); },
  guessOutputFilename: function (fn) { return fn.slice(0, -3) + '.txt'; },
});
```
<!--/include-->


<!--#toc stop="scan" -->



Known issues
------------

* CLI isn't implemented yet
* needs more/better tests and docs




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
