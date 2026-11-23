

interface RecordingStationProps {

}

export default function RecordingStation() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    useEffect(() => {
        if (!isRecording) return;

        const setter = setInterval(() => {
            setRecordingTime(s => s + 1);
        }, 1000);

        return () => clearInterval(setter);
    }, [isRecording]);

    function formatTime(seconds: number) {
        return `${Math.floor(seconds / 60)}:${seconds % 60}`;
    }

    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: '#EBEBD8',
            }}>
                <div
                    onClick={() => setIsRecording(!isRecording)}
                    onMouseEnter={() => setIsRecording(true)}
                    onMouseLeave={() => setIsRecording(false)}
                    style={styles.recordingButtonContainer}
                >
                    {isRecording ? (
                        <div style={styles.recordingButtonStart}>
                            <div style={styles.recordingButtonStartTop}/>
                            <div style={styles.recordingButtonStartBottom}/>
                        </div>

                    ): (
                        <div style={styles.recordingButtonPause}>
                            <div style={styles.recordingButtonPauseBar}/>
                            <div style={styles.recordingButtonPauseBar}/>
                        </div>
                    )}
                </div>

                <div style={styles.recordingTime}>
                    {formatTime(recordingTime)}
                </div>
            </div>
        </>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recordingButtonContainer: {
        width: '24px',
        height: '24px',
        borderRadius: '8px',
    },
    recordingButtonStop: {
        backgroundColor: '#ce3a49',
    },
    recordingButtonStartContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingLeft: '8px',
        paddingRight: '8px',
    },
    recordingButtonStart: {
        backgroundColor: '#9BA685',
        width: '100%',
        height: '100%',
    },
    recordingButtonStartTop: {
        clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
    },
    recordingButtonStartBottom: {
        clipPath: 'polygon(0 0, 0 100%, 100% 50%)',
    },
    recordingButtonPause: {
        backgroundColor: '#ECCEA8',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    recordingButtonPauseBar: {
        width: '35%',
        height: '100%',
    },
    recordingTime: {
        fontSize: '14px',
        fontFamily: 'Inter',
    }
}