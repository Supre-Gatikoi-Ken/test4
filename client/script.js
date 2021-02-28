'use strict';

let apiKey = 'INPUT_YOUR_API_KEY';

$('document').ready(function () {
    let peerId = 'TestPeerID' + Math.floor(Date.now() / 1000);
    let peer = null;
    let existingCall = null;

    // カメラ映像、マイク音声の取得
    let localStream = null;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function (stream) {
            // Success
            $('#my-video').get(0).srcObject = stream;
            localStream = stream;
        }).catch(function (error) {
            // Error
            console.error('mediaDevice.getUserMedia() error:', error);
            return;
        });

    $('#get-btn').click(function () {
        $.post('http://localhost:8080/authenticate',
            {
                peerId: peerId,
                sessionToken: '4CXS0f19nvMJBYK05o3toTWtZF5Lfd2t6Ikr2lID'

            }, function (credential) {
                $('#result').text(JSON.stringify(credential, null, 2));

                // use the credential to create new Peer() here.
                peer = new Peer(peerId, {
                    key: apiKey,
                    credential: credential
                });

                // openイベント
                peer.on('open', function () {
                    $('#my-id').text(peer.id);
                });

                // errorイベント
                peer.on('error', function (err) {
                    alert(err.message);
                });

                // closeイベント
                //   Peer（相手）との接続が切れた際に発火
                peer.on('close', function () {
                    alert('close');
                });

                // disconnectedイベント
                //   シグナリングサーバとの接続が切れた際に発火
                peer.on('disconnected', function () {
                    alert('disconnected');
                });


                // 発信処理
                $('#make-call').submit(function (e) {
                    e.preventDefault();
                    const call = peer.call($('#callto-id').val(), localStream);
                    setupCallEventHandlers(call);
                });

                // 切断処理
                $('#end-call').click(function () {
                    existingCall.close();
                });

                // 着信処理
                peer.on('call', function (call) {
                    call.answer(localStream);
                    setupCallEventHandlers(call);
                });


                // イベントリスナー
                function setupCallEventHandlers(call) {
                    // 既に接続中の場合は一旦既存の接続を切断し、後からきた接続要求を優先
                    if (existingCall) {
                        existingCall.close();
                    }
                    existingCall = call;

                    // 相手のカメラ映像・マイク音声を受信した際に発火
                    call.on('stream', function (stream) {
                        addVideo(call, stream);
                        setupEndCallUI();
                        $('#their-id').text(call.remoteId);
                    });

                    // call.close()による切断処理が実行され、実際に切断されたら発火
                    call.on('close', function () {
                        removeVideo(call.remoteId);
                        setupMakeCallUI();
                    });
                }


                // video要素の再生
                function addVideo(call, stream) {
                    $('#their-video').get(0).srcObject = stream;
                }

                // video要素の削除
                function removeVideo(peerId) {
                    $('#their-video').get(0).srcObject = undefined;
                }


                // ボタンの表示/非表示
                function setupMakeCallUI() {
                    $('#make-call').show();
                    $('#end-call').hide();
                }
                function setupEndCallUI() {
                    $('#make-call').hide();
                    $('#end-call').show();
                }
            }
        ).fail(function () {
            alert('Peer Authentication Failed');
        });
    });
});
