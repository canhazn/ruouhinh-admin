import NumberFormat from 'react-number-format';

export default function NumberFormatCustom(props) {
    const { inputRef, onChange, name, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}

            onValueChange={values => {
                onChange({
                    target: {
                        // cái target này sẽ được chuyền qua onChange
                        // nên nó cần có cả name và value để setState đọc
                        name: name,
                        value: values.value
                    },
                });
            }}
            thousandSeparator
            suffix=" đ"
        />
    );
}