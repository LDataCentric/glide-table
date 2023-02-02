export default function LinksCellEditor({

    children
  }){
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        margin: '4px 0',
      }}>
        <button style={{
          color: "pink", //
          fontWeight: 600,
          alignSelf: 'flex-end',
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          transition: 'background-color 200ms',
          borderRadius: 4,
          padding: '6px 8px',
          cursor: 'pointer',
        }}>
          <button style={{
            color: "pink",//
            fontWeight: 600,
            alignSelf: 'flex-end',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            transition: 'background-color 200ms',
            borderRadius: 4,
            padding: '6px 8px',
            cursor: 'pointer',
          }}>
          </button>
          <div className="gdg-link-title-editor" style={{
            display: 'flex',
            minWidth: 250,
          }}>
            <input style={{
              outline: 'none',
              border: `1px solid ${"blac"}`, //
              borderRadius: 4,
              boxShadow: 'none',
              padding: '6px 8px',
              minWidth: 0,
              width: 0,
              flexGrow: 1,
              transition: 'border 200ms',
            }} />
            <button style={{
              border: 'none',
              outline: 'none',
              borderRadius: 4,
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'background-color 200ms, color 200ms',
              color: "blue", //
            }} />
          </div>
        </button>
        {children}
      </div>
    );  
}