import{j as e}from"./jsx-runtime-u17CrQMm.js";import{I as d,a as m}from"./index-BO6HnBwL.js";import"./iframe-Dgzz1v7W.js";import"./preload-helper-PPVm8Dsz.js";function p(){return e.jsx("svg",{width:"100%",height:"100%",viewBox:"0 0 24 24","aria-hidden":!0,className:"ds-inputSection__leadIcon",children:e.jsx("circle",{cx:"12",cy:"12",r:"6",fill:"currentColor"})})}const S={title:"InputSection",component:d,tags:["autodocs"],decorators:[i=>e.jsx("div",{style:{maxWidth:480,width:"100%"},children:e.jsx(i,{})})],argTypes:{leadSlot:{control:!1,table:{category:"Content",type:{summary:"ReactNode"}}},contentSlot:{control:!1,table:{category:"Content",type:{summary:"ReactNode"}}},label:{table:{category:"Content"}},iconName:{table:{category:"CDN icon"}},iconStyle:{control:"select",options:["outline","fill"],table:{category:"CDN icon"}},cdnBaseUrl:{table:{category:"CDN icon"}},leadColor:{table:{category:"Appearance"}},showLabel:{table:{category:"Layout"}},showContentSlot:{table:{category:"Layout"}}}},o={name:"With CDN icon",args:{label:"Section title",iconName:"formatting-pencil-alt",iconStyle:"outline"}},a={name:"CDN icon (filled)",args:{label:"Filled style",iconName:"formatting-pencil-alt",iconStyle:"fill"}},t={args:{label:"Accent lead",iconName:"formatting-pencil-alt",leadColor:"var(--color-main-accent)"}},n={name:"With custom lead slot",args:{label:"Custom lead",leadSlot:e.jsx(p,{})}},r={args:{label:"Notes",iconName:"formatting-pencil-alt",contentSlot:e.jsx("textarea",{rows:4,placeholder:"Type here…",style:{width:"100%",boxSizing:"border-box",resize:"vertical",padding:"var(--spacing-padding-3)",borderRadius:"var(--radius-lg)",border:"1px solid var(--color-border-weak)",fontFamily:"var(--font-family-sans)",fontSize:"var(--size-3)"}})}},l={args:{label:"No icon",showLabel:!0,iconName:void 0}},s={args:{label:"Header row only",iconName:"formatting-pencil-alt",showContentSlot:!1}},c={args:{showLabel:!1,showContentSlot:!0,contentSlot:e.jsx(m,{})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "With CDN icon",
  args: {
    label: "Section title",
    iconName: "formatting-pencil-alt",
    iconStyle: "outline"
  }
}`,...o.parameters?.docs?.source},description:{story:"Uses the default CDN (`design-system` package `someIconsCdnBaseUrl`). Requires network.",...o.parameters?.docs?.description}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: "CDN icon (filled)",
  args: {
    label: "Filled style",
    iconName: "formatting-pencil-alt",
    iconStyle: "fill"
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Accent lead",
    iconName: "formatting-pencil-alt",
    leadColor: "var(--color-main-accent)"
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: "With custom lead slot",
  args: {
    label: "Custom lead",
    leadSlot: <DemoLeadIcon />
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Notes",
    iconName: "formatting-pencil-alt",
    contentSlot: <textarea rows={4} placeholder="Type here…" style={{
      width: "100%",
      boxSizing: "border-box",
      resize: "vertical",
      padding: "var(--spacing-padding-3)",
      borderRadius: "var(--radius-lg)",
      border: "1px solid var(--color-border-weak)",
      fontFamily: "var(--font-family-sans)",
      fontSize: "var(--size-3)"
    }} />
  }
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: "No icon",
    showLabel: true,
    iconName: undefined
  }
}`,...l.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Header row only",
    iconName: "formatting-pencil-alt",
    showContentSlot: false
  }
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    showLabel: false,
    showContentSlot: true,
    contentSlot: <InputSectionSlotPlaceholder />
  }
}`,...c.parameters?.docs?.source}}};const y=["WithCdnIcon","CdnIconFilled","WithLeadColor","WithCustomLeadSlot","WithCustomContent","LabelOnly","WithoutContentSlot","WithoutLabel"];export{a as CdnIconFilled,l as LabelOnly,o as WithCdnIcon,r as WithCustomContent,n as WithCustomLeadSlot,t as WithLeadColor,s as WithoutContentSlot,c as WithoutLabel,y as __namedExportsOrder,S as default};
