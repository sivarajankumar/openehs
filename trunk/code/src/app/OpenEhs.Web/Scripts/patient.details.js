﻿/// <reference path="jquery-1.4.4.js" />
/// <reference path="jquery.validate.js" />


$(document).ready(function () {
    // ------------------------------------------------- //
    //  Initialize jVerticalTabs Plugin                  //
    // ------------------------------------------------- //
    $("#patientView").jVertTabs({
        equalHeights: true
    });

    $("#vitalsRadio").buttonset();

     $("#checkinRadio").buttonset();

    // ------------------------------------------------- //
    //  Setup Basic Tab                                  //
    // ------------------------------------------------- //
    $("#DateOfBirth").datepicker({
        showOn: "button",
        buttonImage: "/Content/themes/base/images/calendar.png",
        buttonImageOnly: true,
        changeYear: true
    });

    $("#EmergencyContactMoreInfoLink").click(function () {
        $("#EmergencyContactMoreInfo").slideToggle("slow", function () {});
    });

    $("#BasicMoreInfoLink").click(function () {
        $("#BasicMoreInfo").slideToggle("slow", function () {});
    });

    $("#newCheckInButton").button().click(function () {
        $("#newCheckinModal").dialog("open")
    });

    $("#editPatientInfoButton").button().click(function () {

    });


    // ------------------------------------------------- //
    //  Configure CKEditor on Patient Note               //
    // ------------------------------------------------- //
    var ckConfig = {
        toolbar: [
            ["Bold", "Italic", "-", "NumberedList", "BulletedList", "-"],
            ["UIColor"]
        ],
        extraPlugins: "autogrow",
        autoGrow_maxHeight: 800
    };

    $("#patientNoteTextBox").ckeditor(ckConfig);

     // ------------------------------------------------- //
    //  Setup Check In Modal                                //
    // ------------------------------------------------- //
    $("#newCheckinModal").dialog({
        autoOpen: false,
        height: 225,
        width: 375,
        modal: true,
        buttons: {
            "Check In": function () {
            $.ajax({
                type: "POST",
                url: "/Patient/AddCheckIn",
                data: {
                    patientID: $("#patientId").val(),
                    PatientType: $('input:radio[name="modal_checkinType"]:checked').val(),
                    staffId: $('select.location option:selected').val()
                },
                success: function(response) {
                    alert("Success!");
                },
                dataType: "json"
            });
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        },
        close: function() {}
        });
    // ------------------------------------------------- //
    //  Setup Allergy Tab                                //
    // ------------------------------------------------- //
    $("#addAllergyDialog").dialog({
        autoOpen: false,
        height: 225,
        width: 375,
        modal: true,
        buttons: {
            "Add Allergy": function () {
                if ($("#addAllergyForm").valid()) {
                    $.post("/Patient/AddAllergy", {
                        patientID: $("#patientId").val(),
                        allergyName: $("#addAllergyName").val()
                    }, function (returnData) {
                        if (returnData.error == "false") {
                            $("#addAllergyDialog").dialog("close");
                            var newAllergy = '<li class="group" style="display:none" id="allergy_' + returnData.allergy.Id + '"><div style="float: left;">' + returnData.allergy.Name + '</div><div style="float: right;"><input class="allergyRemove" id="' + returnData.allergy.Id + '" type="button" value="Remove" /></div></li>';
                            console.log(newAllergy);
                            $("#allergyList").append(newAllergy);
                            $("#allergy_" + returnData.allergy.Id).fadeIn("normal", function () {
                                $(this).find(".allergyRemove").button().click(removeOnClick)
                            });
                        } else {
                            $("#addAllergyDialog .error").html(returnData.status);
                        }
                    }, "json");
                }
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        close: function () {

        }
    });

    $("#addAllergyForm").validate();

    $("#addAllergyForm").submit(function () {
        return false;
    });


    $("#allergyAddButton").button().click(function () {
        $("#addAllergyDialog").dialog("open")
    });

    var removeOnClick = function () {
        $.post("/Patient/RemoveAllergy", {
            patientID: $("#patientId").val(),
            allergyID: $(this).attr("id")
        }, function (returnData) {
            if (returnData.error == "false") {
                $("#allergy_" + returnData.Id).fadeOut("normal", function () {
                    $(this).remove();
                });
            } else {

            }
        }, "json");
    };

    // Add remove function to every allergy remove button
    $(".allergyRemove").button({
        icons: {
            primary: "ui-icon-closethick"
        },
        text: false
    }).click(removeOnClick);




    // ------------------------------------------------- //
    //  Setup Vitals Tab                                 //
    // ------------------------------------------------- //

    function processVitalsReturn(result) {
        if (result.error == "false") {
            var table = document.getElementById("vitalsTable");
            var tr = document.createElement("tr");

            var elements = new Array();

            for (var i = 0; i < 8; i++)
            elements[i] = document.createElement("td");

            elements[0].appendChild(document.createTextNode(result.date));
            elements[1].appendChild(document.createTextNode(result.type));

            if (result.height != "0") elements[2].appendChild(document.createTextNode(result.height));
            else
            elements[2].appendChild(document.createTextNode("N/A"));

            if (result.weight != "0") elements[3].appendChild(document.createTextNode(result.weight));
            else
            elements[3].appendChild(document.createTextNode("N/A"));

            if (result.temperater != "0") elements[4].appendChild(document.createTextNode(result.temperature));
            else
            elements[4].appendChild(document.createTextNode("N/A"));

            if (result.heartRate != "0") elements[5].appendChild(document.createTextNode(result.heartRate));
            else
            elements[5].appendChild(document.createTextNode("N/A"));

            if (result.bpSystolic != "0") elements[6].appendChild(document.createTextNode(result.bpSystolic + "/" + result.bpDiastolic));
            else
            elements[6].appendChild(document.createTextNode("N/A"));

            if (result.respiratoryRate != "0") elements[7].appendChild(document.createTextNode(result.respiratoryRate));
            else
            elements[7].appendChild(document.createTextNode("N/A"));

            for (var i = 0; i < 8; i++)
            tr.appendChild(elements[i]);

            table.appendChild(tr);

            //Reset form
            $("#modal_vitalHeight").val("");
            $("#modal_vitalWeight").val("");
            $("#modal_vitalTemperature").val("");
            $("#modal_vitalHeartRate").val("");
            $("#modal_vitalBpSystolic").val("");
            $("#modal_vitalBpDiastolic").val("");
            $("#modal_vitalRespiratoryRate").val("");

        } else
        alert("Error");
    }

    $("#newVitalDialog").dialog({
        autoOpen: false,
        height: 400,
        width: 400,
        modal: true,
        buttons: {
            "Save Vital": function () {
                $.ajax({
                    type: "POST",
                    url: "/Patient/AddVital",
                    data: {
                        patientID: $("#patientId").val(),
                        height: $("#modal_vitalHeight").val(),
                        weight: $("#modal_vitalWeight").val(),
                        temperature: $("#modal_vitalTemperature").val(),
                        heartRate: $("#modal_vitalHeartRate").val(),
                        BpSystolic: $("#modal_vitalBpSystolic").val(),
                        BpDiastolic: $("#modal_vitalBpDiastolic").val(),
                        respiratoryRate: $("#modal_vitalRespiratoryRate").val(),
                        type: $('input:radio[name=modal_vitalsType]:checked').val()
                    },
                    success: function (response) {
                        $("#newVitalDialog").dialog("close");
                        processVitalsReturn(response);
                    },
                    dataType: "json"
                });

            },

            Cancel: function () {
                $(this).dialog("close");
            }
        },

        close: function () {}
    });
    $(".vitalAddButton").button().click(function () {
        $("#newVitalDialog").dialog("open");
    });


    // ------------------------------------------------- //
    //  Setup Chronic Diseases Tab                       //
    // ------------------------------------------------- //
    $("#diseaseDialog").dialog({
        autoOpen: false,
        height: 300,
        width: 350,
        modal: true,
        buttons: {
            "Save Disease": function () {
                var bValid = true;
                allFields.removeClass("ui-state-error");

                if (bValid) {
                    $(this).dialog("close");
                }
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            allFields.removeClass("ui-state-error");
        }
    });

    $(".diseaseEditButton").button().click(function () {
        $("#diseaseDialog").dialog("open");
    });

    $(".chronicDiseasesAddButton").button().click(function () {});

    $(".chronicDiseasesRemove").button().click(function () {});


    // ------------------------------------------------- //
    //  Setup Prescription List Tab                      //
    // ------------------------------------------------- //
    $(".medicationAddButton").button().click(function () {
        $("#newMedicationDialog").dialog("open");
    });

    $(".medicationPrintButton").button().click(function () {});

    $("#rxInfoLink").click(function () {
        $("#rxMoreInfo").slideToggle("slow", function () {});
    });

    $("#newMedicationDialog").dialog({
        autoOpen: false,
        height: 400,
        width: 400,
        modal: true,
        buttons: {
            "Save Medication": function () {
                $.post("/Patient/AddMedication", {
                    patientID: $("#patientId").val(),
                    name: $("#modal_medicationName").val(),
                    instructions: $("#modal_medicationInstructions").val(),
                    startdate: $("#startDatePicker").val(),
                    expdate: $("#expDatePicker").val()

                });
                $(this).dialog("close");

            },
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            allFields.removeClass("ui-state-error");
        }
    });

    $("#RxStartDatePicker").datepicker({
        showOn: "button",
        buttonImage: "/Content/themes/base/images/calendar.png",
        buttonImageOnly: true,
        changeYear: true
    });

    $("#RxExpDatePicker").datepicker({
        showOn: "button",
        buttonImage: "/Content/themes/base/images/calendar.png",
        buttonImageOnly: true,
        changeYear: true
    });

    // ------------------------------------------------- //
    //  Setup Immunizations List Tab                      //
    // ------------------------------------------------- //
    $("#immunizationAddButton").button().click(function () {
        $("#newImmunizationDialog").dialog("open")
    });

    $("#immunizationInfoLink").click(function () {
        $("#immunizationMoreInfo").slideToggle("slow", function () {});
    });

    $("#newImmunizationDialog").dialog({
        autoOpen: false,
        height: 400,
        width: 400,
        modal: true,
        buttons: {
            "Save Immunization": function () {
                $.post("/Patient/AddImmunization", {
                    patientID: $("#patientId").val(),
                    vaccinetype: $("#modal_immunizationVaccineType").val(),
                    dateadministered: $("#modal_immunizationDateAdministered").val(),

                });
                $(this).dialog("close");

            },
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            allFields.removeClass("ui-state-error");
        }
    });

    // ------------------------------------------------- //
    //  Setup Visit History List Tab                     //
    // ------------------------------------------------- //
    $("#visitNoteLink").click(function () {
        $("#visitNoteMoreInfo").slideToggle("slow", function () {});
    });

    $("#visitVitalsLink").click(function () {
        $("#visitVitalsMoreInfo").slideToggle("slow", function () {});
    });

    $("#visitPastLink").click(function () {
        $("#visitPastMoreInfo").slideToggle("slow", function () {});
    });

    $("#visitVitalsLinkSearch").click(function () {
        $("#visitVitalsMoreInfoSearch").slideToggle("slow", function () {});
    });

    $("#visitNoteLinkSearch").click(function () {
        $("#visitNoteMoreInfoSearch").slideToggle("slow", function () {});
    });

    $("#visitHistorySearchButton").button().click(function () {
        $.ajax({
            type: "POST",
            url: "/Patient/SearchVisit",
            data: {
                patientID: $("#patientId").val(),
                from: $("#from").val(),
                to: $("#to").val()
            },
            success: function (response) {
                //addSearchRow(response);
                //Code for date pick
                for(var i = 0; i < response.length; i++)
                {
                    var select = '<table><thead><tr><th>' + responce[0].Date + '</th>    </tr></thead><tbody></tbody></table>';
                } 


                //Code fore table
                /*
                for (var i = 0; i < 1; i++)
                {
                for(var x = 0; x < response[i].Vitals.length; x++)
                {

                    var vital = response[i].Vitals[x];

                    var searchResult = '<ul id="visitHistorySearchList"><li class="group"><div style="float: left;"><b>Visit Date: </b>' + response[0].date + '</div><br /><div style="float: left;"><b>Diagnosis: </b>' + response[0].Diagnosis + '</div><br />     <div><div><b>' + "Vitals:" + '</b></div></div><div><table id="vitalHistory1" class="vitalsHist1"><thead><tr><th>' + "Time" + '</th><th>' + "Type" + '</th><th>' + "Height(cm)" + '</th><th>' + "Weight(kg)" + '</th><th>' + "Temp(&deg;C)" + '</th><th>' + "HR(bpm)" + '</th><th>' + "BP(mmHg)" + '</th><th>' + "RR(Hz)" + '</th></tr></thead><tbody><tr><td>' + vital.Time + '</td><td>' + vital.type + '</td><td>' + vital.Height + '</td><td>' + vital.Weight + '</td><td>' + vital.Temperature + '</td><td>' + vital.HeartRate + '</td><td>' + vital.BpSystolic + "/" + vital.BpDiastolic + '</td><td>' + vital.RespiratoryRate + '</td></tr></tbody></table><div><b>' + "Notes: " + '</b>' + "This is where notes go!" + '</div></li></ul>';
                    //console.log(searchResult);
                    $("#visitHistorySearchList").replaceWith(searchResult);
                }
                }
                */

            },
            dataType: "json"
        });

    });

    function addSearchRow(result) {
/*
        alert(result.length);
        for (var i = 0; i < result.length; i++)
        {
            alert("Diagnosis: " + result[i].Diagnosis);
            alert("Check-in Time: " + result[i].CheckInTime);

            for(var x = 0; x < result[i].Vitals.length; x++)
            {
                var vital = result[i].Vitals[x];

                alert("Blood Pressure: " + vital.BpSystolic + "/" + vital.BpDiastolic);
            }
        }
        */
    }

    $(function () {
        var dates = $("#from, #to").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 3,
            onSelect: function (selectedDate) {
                var option = this.id == "from" ? "minDate" : "maxDate",
                    instance = $(this).data("datepicker");
                date = $.datepicker.parseDate(
                instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
                dates.not(this).datepicker("option", option, date);
            }
        });
    });


});