const fs = require('fs');

function processFile(srcFilePath, patchFilePath, key, sections){
    const sourceContents = fs.readFileSync(srcFilePath, 'utf8');
    const sourceObj = JSON.parse(sourceContents);

    const patchContents = fs.readFileSync(patchFilePath);
    const patchObj = JSON.parse(patchContents);
    patchObj.tags.forEach(patchObjTag =>{
        const sourceObjTag = sourceObj.tags.find(test => (test.name === patchObjTag.name));
        if(!sourceObjTag) throw "tag " + sourceObjTag.name + " not found." 
        sections.forEach( section =>{
            patchSection(sourceObjTag, patchObjTag, key, section)
        });
    })

    fs.writeFileSync(srcFilePath, JSON.stringify(sourceObj), 'utf8');
}

function patchSection(sourceObjTag, patchObjTag, key, section){
    const patchSection = patchObjTag[section];
    if(!patchSection) return;
    const sourceSection = sourceObjTag[section];
    if(!sourceSection) {
        throw section + " not found in source file."; 
    }
    patchObjTag[section].forEach(entry =>{
        const sourceSectionEntry = sourceSection.find(test => (test.name === entry.name));
        if(!sourceSectionEntry){
            throw `${section}[${entry}] not found.`
        }
        Object.assign(sourceSectionEntry, entry);
    })
}

exports.patchFile = function(srcFilePath, patchFilePath){
    processFile(srcFilePath, patchFilePath, 'name', ['attributes', 'properties', 'events']);
}