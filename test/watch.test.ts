import nn from '../src/index';
test("basic watch data properties", () => {
    let old = '';
    const x = new nn({
        data: {
            asdf: 'asdf'
        },
        watch: {
            asdf () {
                old = 'asdff';
            }
        }
    });
    expect(old).toBe('');
    x.state.asdf = 'a;sldkfa;lskjd;falksdf';
    expect(old).toBe('asdff');
});


test("watch has new properties in this", () => {
    let old = '';
    const x = new nn({
        data: {
            asdf: 'asdf'
        },
        watch: {
            asdf () {
                old = this.state.asdf;
            }
        }
    });
    expect(old).toBe('');
    x.state.asdf = 'a;sldkfa;lskjd;falksdf';
    expect(old).toBe(x.state.asdf);
});
