import{j as e}from"./jsx-runtime-u17CrQMm.js";import{S as n}from"./index-BO6HnBwL.js";import"./iframe-Dgzz1v7W.js";import"./preload-helper-PPVm8Dsz.js";const l=`
  .sb-sidebar-story {
    height: min(100dvh, 640px);
    display: flex;
    flex-direction: column;
  }
  .sb-sidebar-story aside.ds-sidebar {
    height: 100%;
    max-height: 100%;
  }
`,u={title:"Sidebar",component:n,tags:["autodocs"],decorators:[t=>e.jsxs(e.Fragment,{children:[e.jsx("style",{children:l}),e.jsx("div",{className:"sb-sidebar-story",children:e.jsx(t,{})})]})],argTypes:{children:{control:!1,table:{category:"Content",type:{summary:"ReactNode"}}},pageName:{control:"text",table:{category:"Header"}},version:{table:{category:"Header"}},logo:{control:!1,table:{category:"Header",type:{summary:"ReactNode"}}},themeButton:{control:!1,table:{category:"Header",type:{summary:"ReactNode"}}},copyright:{control:"text",table:{category:"Footer"}},socialButtons:{control:!1,table:{category:"Footer",type:{summary:"ReactNode"}}}}},a={args:{pageName:"Some Icons",version:"1.0.0",children:null}},o={args:{pageName:"Page",version:void 0,children:null}},r={name:"Custom logo & theme",args:{pageName:"Dashboard",version:"2.4.0",logo:e.jsx("div",{style:{width:40,height:40,borderRadius:8,background:"var(--color-main-accent)",opacity:.85},"aria-label":"App logo"}),themeButton:e.jsx("button",{type:"button",style:{width:40,height:40,borderRadius:8,border:"1px solid var(--color-border-weak)",background:"var(--color-fill-background-elevation)",cursor:"pointer"},"aria-label":"Toggle theme"}),children:null}},s={args:{pageName:"Docs",copyright:"© 2025 Custom Org",socialButtons:e.jsxs("div",{className:"ds-sidebar__social",children:[e.jsx("a",{href:"https://example.com",className:"ds-sidebar__socialLink",style:{fontSize:12},children:"GitHub"}),e.jsx("a",{href:"https://example.com",className:"ds-sidebar__socialLink",style:{fontSize:12},children:"X"})]}),children:null}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    pageName: "Some Icons",
    version: "1.0.0",
    children: null
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    pageName: "Page",
    version: undefined,
    children: null
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "Custom logo & theme",
  args: {
    pageName: "Dashboard",
    version: "2.4.0",
    logo: <div style={{
      width: 40,
      height: 40,
      borderRadius: 8,
      background: "var(--color-main-accent)",
      opacity: 0.85
    }} aria-label="App logo" />,
    themeButton: <button type="button" style={{
      width: 40,
      height: 40,
      borderRadius: 8,
      border: "1px solid var(--color-border-weak)",
      background: "var(--color-fill-background-elevation)",
      cursor: "pointer"
    }} aria-label="Toggle theme" />,
    children: null
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    pageName: "Docs",
    copyright: "© 2025 Custom Org",
    socialButtons: <div className="ds-sidebar__social">
        <a href="https://example.com" className="ds-sidebar__socialLink" style={{
        fontSize: 12
      }}>
          GitHub
        </a>
        <a href="https://example.com" className="ds-sidebar__socialLink" style={{
        fontSize: 12
      }}>
          X
        </a>
      </div>,
    children: null
  }
}`,...s.parameters?.docs?.source}}};const p=["Default","WithoutVersion","CustomHeaderSlots","CustomFooter"];export{s as CustomFooter,r as CustomHeaderSlots,a as Default,o as WithoutVersion,p as __namedExportsOrder,u as default};
