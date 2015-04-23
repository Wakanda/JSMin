/* Copyright (c) 4D, 2012-2013
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

include("fulljsmin.js");

exports.handleMessage = function handleMessage(message) {
    if (message.action == 'minify') {
        var original_code = studio.currentEditor.getContent();
        var smaller_code = jsmin(original_code, 2);
        studio.currentEditor.selectFromStartOfText(0, 1000000);
        studio.currentEditor.insertText(smaller_code);
        var ratio = 100 * (smaller_code.length / original_code.length);
        studio.alert('Original size: ' + original_code.length + '\n'
        			   + 'Minified size: ' + smaller_code.length + '\n'
        			   + 'Compression ratio: ' + ratio.toFixed(2) + '%');
    }
    else if (message.action == 'minifyFile') {
        var selectedFiles = studio.currentSolution.getSelectedItems();
        var original_length = 0;
        var smaller_length = 0;
        for (var i = 0; i < selectedFiles.length; i++) {
            var jsFile = selectedFiles[i];
            var filePath = jsFile.path;
            var minifiedPath = filePath.substr(0, filePath.length - jsFile.extension.length - 1);
            minifiedPath += '-min.';
            minifiedPath += jsFile.extension;
            var jsMinifiedFile = File(minifiedPath);
            if (!jsMinifiedFile.exists)
                jsMinifiedFile.create();

            var original_code = jsFile.toString();
            var smaller_code = jsmin(original_code, 2);

            original_length += original_code.length;
            smaller_length += smaller_code.length;

            var stream = new TextStream(jsMinifiedFile, "Overwrite");
            stream.write(smaller_code);
            stream.close();
        }

        var ratio = 100 * (smaller_length / original_length);
        studio.alert('Original size: ' + original_length + '\n'
        			  + 'Minified size: ' + smaller_length + '\n'
        			  + 'Compression ratio: ' + ratio.toFixed(2) + '%');


    }
}
