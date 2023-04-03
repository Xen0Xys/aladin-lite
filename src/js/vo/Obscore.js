    // Copyright 2013 - UDS/CNRS
// The Aladin Lite program is distributed under the terms
// of the GNU General Public License version 3.
//
// This file is part of Aladin Lite.
//
//    Aladin Lite is free software: you can redistribute it and/or modify
//    it under the terms of the GNU General Public License as published by
//    the Free Software Foundation, version 3 of the License.
//
//    Aladin Lite is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU General Public License for more details.
//
//    The GNU General Public License is available in COPYING file
//    along with Aladin Lite.
//




/******************************************************************************
 * Aladin Lite project
 * 
 * File Obscore
 * 
 * Author: Matthieu Baumann[CDS]
 * 
 *****************************************************************************/
 import { VOTable } from "./VOTable.js";
 import { Utils } from './../Utils.js';
 import { Source } from './../Source.js';

 export let Obscore = (function() {

    // dict of mandatory obscore fields
    Obscore.MANDATORY_FIELDS = {
        'dataproduct_type': { name: 'dataproduct_type', ucd: 'meta.id', utype: 'ObsDataset.dataProductType', units: null },
        'calib_level': { name: 'calib_level', ucd: 'meta.code;obs.calib', utype: 'ObsDataset.calibLevel', units: null },
        'obs_collection': { name: 'obs_collection', ucd: 'meta.id', utype: 'DataID.collection', units: null },
        'obs_id': { name: 'obs_id', ucd: 'meta.id', utype: 'DataID.observationID', units: null },
        'obs_publisher_did': { name: 'obs_publisher_did', ucd: 'meta.ref.uri;meta.curation', utype: 'Curation.publisherDID', units: null },
        'access_url': { name: 'access_url', ucd: 'meta.ref.url', utype: 'Access.reference', units: null },
        'access_format': { name: 'access_format', ucd: 'meta.code.mime', utype: 'Access.format', units: null },
        'access_estsize': { name: 'access_estsize', ucd: 'phys.size;meta.file', utype: 'Access.size', units: 'kbyte' },
        'target_name': { name: 'target_name', ucd: 'meta.id;src', utype: 'Target.name', units: null },
        's_ra': { name: 's_ra', ucd: 'pos.eq.ra', utype: 'Char.SpatialAxis.Coverage.Location.Coord.Position2D.Value2.C1', units: 'deg' },
        's_dec': { name: 's_dec', ucd: 'pos.eq.dec', utype: 'Char.SpatialAxis.Coverage.Location.Coord.Position2D.Value2.C2', units: 'deg' },
        's_fov': { name: 's_fov', ucd: 'phys.angSize;instr.fov', utype: 'Char.SpatialAxis.Coverage.Bounds.Extent.diameter', units: 'deg' },
        's_region': { name: 's_region', ucd: 'pos.outline;obs.field', utype: 'Char.SpatialAxis.Coverage.Support.Area', units: null },
        's_resolution': { name: 's_resolution', ucd: 'pos.angResolution', utype: 'Char.SpatialAxis.Resolution.Refval.value', units: 'arcsec' },
        's_xel1': { name: 's_xel1', ucd: 'meta.number', utype: 'Char.SpatialAxis.numBins1', units: null },
        's_xel2': { name: 's_xel2', ucd: 'meta.number', utype: 'Char.SpatialAxis.numBins2', units: null },
        
        't_min': { name: 't_min', ucd: 'time.start;obs.exposure', utype: 'Char.TimeAxis.Coverage.Bounds.Limits.StartTime', units: 'd' },
        't_max': { name: 't_max', ucd: 'time.end;obs.exposure', utype: 'Char.TimeAxis.Coverage.Bounds.Limits.StopTime', units: 'd' },
        't_exptime': { name: 't_exptime', ucd: 'time.duration;obs.exposure', utype: 'Char.TimeAxis.Coverage.Support.Extent', units: 's' },
        't_resolution': { name: 't_resolution', ucd: 'time.resolution', utype: 'Char.TimeAxis.Resolution.Refval.value', units: 's' },
        't_xel': { name: 't_xel', ucd: 'meta.number', utype: 'Char.TimeAxis.numBins', units: null },
        
        'em_min': { name: 'em_min', ucd: 'em.wl;stat.min', utype: 'Char.SpectralAxis.Coverage.Bounds.Limits.LoLimit', units: 'm' },
        'em_max': { name: 'em_max', ucd: 'em.wl;stat.max', utype: 'Char.SpectralAxis.Coverage.Bounds.Limits.HiLimit', units: 'm' },
        'em_res_power': { name: 'em_res_power', ucd: 'spect.resolution', utype: 'Char.SpectralAxis.Resolution.ResolPower.refVal', units: null },
        'em_xel': { name: 'em_xel', ucd: 'meta.number', utype: 'Char.SpectralAxis.numBins', units: null },

        'o_ucd': { name: 'o_ucd', ucd: 'meta.ucd', utype: 'Char.ObservableAxis.ucd', units: null },
        'pol_states': { name: 'pol_states', ucd: 'meta.code;phys.polarization', utype: 'Char.PolarizationAxis.stateList', units: null },
        'pol_xel': { name: 'pol_xel', ucd: 'meta.number', utype: 'Char.PolarizationAxis.numBins', units: null },
        'facility_name': { name: 'facility_name', ucd: 'meta.id;instr.tel', utype: 'Provenance.ObsConfig.Facility.name', units: null },
        'instrument_name': { name: 'instrument_name', ucd: 'meta.id;instr', utype: 'Provenance.ObsConfig.Instrument.name', units: null },
    }

    Obscore.clickOnAccessUrlAction = function(accessUrl) {
        // Parse the datalink as a votable
        VOTable.parse(accessUrl, (fields, rows) => {
            console.log(fields)
        })
    }

    Obscore.COLOR = '#004500'

    function Obscore() {};

    Obscore.parseFields = function(fields) {
        let parsedFields = {};

        const raField = Obscore.MANDATORY_FIELDS['s_ra'];
        const decField = Obscore.MANDATORY_FIELDS['s_dec'];
        const regionField = Obscore.MANDATORY_FIELDS['s_region'];
        const accessUrlField = Obscore.MANDATORY_FIELDS['access_url'];

        let raFieldIdx = Obscore.findMandatoryField(fields, raField.name, raField.ucd, raField.utype);
        let decFieldIdx = Obscore.findMandatoryField(fields, decField.name, decField.ucd, decField.utype);
        let regionFieldIdx = Obscore.findMandatoryField(fields, regionField.name, regionField.ucd, regionField.utype);
        let accessUrlFieldIdx = Obscore.findMandatoryField(fields, accessUrlField.name, accessUrlField.ucd, accessUrlField.utype);

        let fieldIdx = 0;
        fields.forEach((field) => {
            let key = field.name ? field.name : field.id;

            let nameField;
            if (fieldIdx == raFieldIdx) {
                nameField = 's_ra';
            } else if (fieldIdx == decFieldIdx) {
                nameField = 's_dec';
            } else if (fieldIdx == regionFieldIdx) {
                nameField = 's_region';
            } else if (fieldIdx == accessUrlFieldIdx) {
                nameField = 'access_url';
            } else {
                nameField = key;
            }

            parsedFields[nameField] = {
                name: key,
                idx: fieldIdx,
            };

            fieldIdx++;
        })

        return parsedFields;
    };


    // Find a specific field idx amond the VOTable fields
    //
    // @param fields: list of objects with ucd, unit, ID, name attributes
    // @param nameField:  index or name of the targeted column (might be undefined)
    // @param ucdField:  ucd of the targeted column (might be undefined)
    // @param possibleNames:  possible names of the targeted columns (might be undefined)
    //
    Obscore.findMandatoryField = function(fields, nameField = null, ucdField = null, utypeField = null) {
        if (Utils.isInt(nameField) && nameField < fields.length) {
            // nameField can be given as an index
            return nameField;
        }

        // First, look if the name has been already given
        // ID or name of the field given
        if (nameField) { 
            for (var l=0, len=fields.length; l<len; l++) {
                var field = fields[l];
                
                if ( (field.ID && field.ID===nameField) || (field.name && field.name===nameField)) {
                    return l;
                }
            }
        }

        // If not already given, let's guess position column on the basis of UCDs
        if (ucdField) {
            var ucdFieldOld = ucdField.replace('.', '_');

            for (var l = 0, len = fields.length; l < len; l++) {
                var field = fields[l];

                if (field.ucd) {
                    var ucd = $.trim(field.ucd.toLowerCase());

                    if (ucd.indexOf(ucdField) == 0 || ucd.indexOf(ucdFieldOld) == 0) {
                        return l;
                    }
                }
            }
        }

        // Still not found ? guess the position from the utype
        if (utypeField) {
            for (var l = 0, len = fields.length; l < len; l++) {
                var field = fields[l];

                if (field.utype) {
                    var utype = $.trim(field.utype.toLowerCase());

                    if (utype === utypeField) {
                        return l;
                    }
                }
            }
        }

        throw 'Mandatory field ' + nameField + ' not found';
    };
 
    return Obscore;
})();
 