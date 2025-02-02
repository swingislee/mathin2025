import { useState, useEffect } from "react";

function useLongPress(onShortPress: () => void, onLongPress: () => void, longPressDuration: number = 500) {
    const [isLongPressActivated, setIsLongPressActivated] = useState(false);
    const [hasMoved, setHasMoved] = useState(false);
    const [accidentPress, setAccidentPress] = useState(false);
    let pressTimer: NodeJS.Timeout;

    const startPress = (event: React.MouseEvent | React.TouchEvent) => {
        setAccidentPress(false);
        event.preventDefault();
        event.stopPropagation();  // Prevent the event from propagating to the document
        setHasMoved(false); // Reset movement status

        // Start a timer for long press detection
        pressTimer = setTimeout(() => {
            if (!hasMoved) {
                setIsLongPressActivated(true);
                onLongPress();  // Trigger long press callback
            }
        }, longPressDuration);
    };

    const handleMove = () => {
        setHasMoved(true);
        clearTimeout(pressTimer);  // If there’s any movement, cancel long press detection
    };

    const endPress = (event: React.MouseEvent | React.TouchEvent) => {
        if (accidentPress) return;

        event.preventDefault();
        clearTimeout(pressTimer); // Clear the timer if press ends

        if (!isLongPressActivated && !hasMoved) {
            onShortPress();  // Trigger short press callback
        }

        // Reset long press activation
        setIsLongPressActivated(false);
    };

    // Cleanup the timer on component unmount
    useEffect(() => {
        return () => {
            clearTimeout(pressTimer);
        };
    }, []);

    return {
        onTouchStart: startPress,
        onMouseDown: startPress,
        onMouseUp: endPress,
        onTouchEnd: endPress,
        onTouchMove: handleMove
    };
}

export default useLongPress;
