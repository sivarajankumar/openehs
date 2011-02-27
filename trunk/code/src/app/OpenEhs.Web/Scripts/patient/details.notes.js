﻿/// <reference path="../jquery-1.4.4.js" />
/// <reference path="../jquery.validate.js" />
/// <reference path="../jquery.ui.js" />
/// <reference path="../jquery-jvert-tabs-1.1.4.js" />

$(function () {
    var ckConfig = {
        toolbar: [
            ["Bold", "Italic", "-", "NumberedList", "BulletedList", "-"],
            ["UIColor"]
        ],
        extraPlugins: "autogrow",
        autoGrow_maxHeight: 800
    };
    $("#NotesTextBox").ckeditor(ckConfig);

    $("#submitNoteButton").button().click(function () {
        $("#newNoteDialog").dialog("open");
    });

    $("#newNoteDialog").dialog({
        autoOpen: false,
        height: 600,
        width: 710,
        modal: true,
        buttons: {
            "Submit Note": function () {
                $.post("/Patient/AddNote", {
                    patientID: $("#patientId").val(),
                    NoteBody: escape($("#NotesTextBox").val()),
                    TemplateTitle: $("#templateTitle").val()
                }, function (result) {
                    $("#newNoteDialog").dialog("close");


                    var output = result.NoteBody + '<br />';
                    $("#submittedNoteList").append(output);
                    //TODO: NEED TO MAKE THIS RESPOND TO THE BULLETS AND OTHER INPUTS


                    $("#NotesTextBox").val("");
                    $("#templateTitle").val("");

                }, "json");
            },
            Cancel: function () {
                $("#NotesTextBox").val("");
                $("#templateTitle").val("");


                $(this).dialog("close");
            }
        },
        close: function () {

        }
    });


    $("#templateNoteCheckBox").live('click', function () {
        var htmlOutput = '<div><br /><br /><fieldset id="templateTitleFS"><b>Template Title:</b><br /><input id="templateTitle"></fieldset></div>';

        $("#addTempTitleDIV").replaceWith(htmlOutput);
    });

    $("#templateNoteCheckBox").button().click(function () {

    });

});