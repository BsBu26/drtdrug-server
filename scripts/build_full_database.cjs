const fs = require('fs');
const path = require('path');

const RAW_XET_NGHIEM = [
  { name: "AFB trực tiếp nhuộm Ziehl-Neelsen", price: 74200, prep: "Lấy đờm sâu từ phế quản vào sáng sớm khi vừa thức dậy sau khi súc miệng bằng nước lọc sạch.", desc: "Kỹ thuật nhuộm soi kính hiển vi trực tiếp tìm trực khuẩn kháng cồn kháng toan (AFB) gây bệnh lao phổi." },
  { name: "Dengue virus NS1Ag test nhanh", price: 142500, prep: "Không cần nhịn ăn. Lấy máu tốt nhất trong 1 - 5 ngày đầu kể từ khi khởi sốt.", desc: "Xét nghiệm sắc ký miễn dịch định tính kháng nguyên NS1 của virus Dengue trong máu giúp phát hiện sớm sốt xuất huyết." },
  { name: "Định lượng Acid Uric [Máu]", price: 22400, prep: "Nhịn ăn ít nhất 4 - 8 giờ trước khi lấy máu, không uống rượu bia và hạn chế thức ăn nhiều đạm (thịt bò, hải sản) tối hôm trước.", desc: "Đo nồng độ acid uric trong huyết thanh phục vụ chẩn đoán bệnh Gout, đánh giá lắng đọng tinh thể urat và chức năng đào thải qua thận." },
  { name: "Định lượng Albumin [Máu]", price: 22400, prep: "Nên nhịn ăn sáng trước khi lấy máu để kết quả sinh hóa chính xác nhất.", desc: "Đánh giá nồng độ Albumin huyết thanh - protein chính do gan tổng hợp, giúp đánh giá tình trạng dinh dưỡng, bệnh lý gan và thận." },
  { name: "Định lượng Bilirubin toàn phần [Máu]", price: 22400, prep: "Nhịn ăn ít nhất 4 tiếng trước khi lấy máu, tránh thức ăn nhiều dầu mỡ.", desc: "Đo tổng lượng sắc tố mật trong máu, giúp phát hiện và chẩn đoán nguyên nhân vàng da, tan máu hoặc tổn thương gan mật." },
  { name: "Định lượng Bilirubin trực tiếp [Máu]", price: 22400, prep: "Nhịn ăn 4 - 8 tiếng trước khi lấy mẫu máu.", desc: "Xác định phần Bilirubin liên hợp đã qua chuyển hóa tại gan, hỗ trợ phân biệt các thể vàng da tắc mật tại gan hoặc sau gan." },
  { name: "Định lượng Cholesterol toàn phần (máu)", price: 28000, prep: "Bắt buộc nhịn ăn từ 8 - 12 giờ trước khi lấy máu (chỉ uống nước lọc), không uống rượu bia tối hôm trước.", desc: "Đo tổng lượng cholesterol trong máu, giúp tầm soát rối loạn lipid máu, đánh giá nguy cơ xơ vữa động mạch và bệnh tim mạch." },
  { name: "Định lượng Creatinin (máu)", price: 22400, prep: "Nên nhịn ăn sáng, tránh ăn nhiều thịt đỏ và không vận động gắng sức trước khi lấy máu.", desc: "Chỉ số quan trọng nhất đánh giá chức năng lọc cầu thận và bài tiết của thận, giúp phát hiện sớm suy thận cấp hoặc mạn." },
  { name: "Định lượng Ethanol (cồn) [Máu]", price: 33600, prep: "Lấy mẫu máu tĩnh mạch. Không sát khuẩn vùng lấy máu bằng cồn y tế.", desc: "Đo nồng độ cồn Ethanol trong máu phục vụ cấp cứu ngộ độc rượu hoặc giám định y khoa theo quy định pháp luật." },
  { name: "Định lượng Glucose [Máu]", price: 22400, prep: "Bắt buộc nhịn ăn ít nhất 8 tiếng trước khi lấy máu (thường lấy máu vào buổi sáng).", desc: "Đo nồng độ đường trong máu lúc đói, giúp chẩn đoán và theo dõi điều trị bệnh đái tháo đường (tiểu đường)." },
  { name: "Định lượng HbA1c [Máu]", price: 105300, prep: "Không cần nhịn ăn, có thể lấy máu vào bất kỳ thời điểm nào trong ngày.", desc: "Phản ánh mức đường huyết trung bình của cơ thể trong 2 - 3 tháng gần nhất, tiêu chuẩn vàng kiểm soát biến chứng tiểu đường." },
  { name: "Định lượng HDL-C (High density lipoprotein Cholesterol) [Máu]", price: 28000, prep: "Nhịn ăn từ 8 - 12 tiếng trước khi lấy máu.", desc: "Đo nồng độ Cholesterol lipoprotein tỷ trọng cao (cholesterol tốt), giúp bảo vệ thành mạch chống mảng xơ vữa." },
  { name: "Định lượng LDL-C (Low density lipoprotein Cholesterol) [Máu]", price: 28000, prep: "Nhịn ăn từ 8 - 12 tiếng trước khi lấy máu.", desc: "Đo nồng độ Cholesterol lipoprotein tỷ trọng thấp (cholesterol xấu), yếu tố nguy cơ hàng đầu gây xơ vữa tắc nghẽn mạch máu." },
  { name: "Định lượng Triglycerid (máu) [Máu]", price: 28000, prep: "Nhịn ăn ít nhất 10 - 12 giờ trước khi lấy máu. Tránh thức ăn nhiều dầu mỡ tối hôm trước.", desc: "Đo nồng độ chất béo trung tính trong máu. Tăng cao Triglycerid làm tăng nguy cơ viêm tụy cấp và xơ vữa động mạch." },
  { name: "Định lượng Urê máu [Máu]", price: 22400, prep: "Nên nhịn ăn sáng trước khi lấy máu.", desc: "Đánh giá sản phẩm thoái hóa của protein bài tiết qua thận, hỗ trợ chẩn đoán chức năng thận và chuyển hóa đạm." },
  { name: "Định tính Amphetamine (test nhanh) [niệu]", price: 44800, prep: "Lấy mẫu nước tiểu tươi trực tiếp vào lọ đựng theo hướng dẫn của nhân viên y tế.", desc: "Xét nghiệm test nhanh sắc ký miễn dịch định tính chất kích thích Amphetamine (thuốc lắc, hồng phiến) trong nước tiểu." },
  { name: "Định tính Codein (test nhanh) [niệu]", price: 44800, prep: "Lấy mẫu nước tiểu tại chỗ. Báo cho nhân viên y tế nếu đang sử dụng các thuốc giảm đau/thuốc ho có chứa codein.", desc: "Xét nghiệm định tính tìm dẫn xuất Codein (nhóm giảm đau gây nghiện) trong nước tiểu." },
  { name: "Định tính Heroin (test nhanh) [niệu]", price: 44800, prep: "Lấy mẫu nước tiểu tươi nguyên chất dưới sự hướng dẫn của cán bộ y tế.", desc: "Xét nghiệm định tính phát hiện chất chuyển hóa của Heroin trong nước tiểu." },
  { name: "Định tính Marijuana (THC) (test nhanh) [niệu]", price: 44800, prep: "Lấy mẫu nước tiểu tươi vào lọ nghiệm sạch.", desc: "Xét nghiệm nhanh định tính Tetrahydrocannabinol (THC - hoạt chất chính trong cần sa) trong nước tiểu." },
  { name: "Định tính Morphin (test nhanh) [niệu]", price: 44800, prep: "Lấy mẫu nước tiểu theo quy trình kiểm tra chất kích thích.", desc: "Xét nghiệm test nhanh phát hiện Morphin và dẫn xuất thuốc phiện trong nước tiểu phục vụ khám tuyển lao động, lái xe." },
  { name: "Định tính Opiate (test nhanh) [niệu]", price: 44800, prep: "Lấy mẫu nước tiểu tươi không pha loãng.", desc: "Xét nghiệm test nhanh tổng quát nhóm chất dạng thuốc phiện (Opiates) trong nước tiểu." },
  { name: "Đo hoạt độ ALT (GPT) [Máu]", price: 22400, prep: "Nhịn ăn ít nhất 4 - 6 giờ trước khi lấy máu, không uống rượu bia trong 24 giờ trước đó.", desc: "Đo enzym men gan ALT đặc hiệu trong tế bào gan, giúp phát hiện sớm tổn thương viêm gan cấp hoặc mạn tính." },
  { name: "Đo hoạt độ AST (GOT) [Máu]", price: 22400, prep: "Nhịn ăn sáng, tránh vận động gắng sức trước khi lấy máu.", desc: "Đo enzym men gan AST có trong tế bào gan và cơ tim, hỗ trợ đánh giá mức độ hoại tử tế bào gan." },
  { name: "Đo hoạt độ GGT (Gama Glutamyl Transferase) [Máu]", price: 20000, prep: "Nhịn ăn ít nhất 8 tiếng trước khi lấy máu, tuyệt đối không uống rượu bia trong 24 giờ trước xét nghiệm.", desc: "Đo men GGT nhạy cảm trong tổn thương đường mật, ứ mật và tổn thương tế bào gan do rượu bia." },
  { name: "Đường máu mao mạch", price: 16000, prep: "Rửa tay sạch bằng nước ấm trước khi thực hiện bấm kim lấy giọt máu mao mạch ở đầu ngón tay.", desc: "Đo nhanh đường huyết tại chỗ bằng máy đo cá nhân, có kết quả tức thì trong cấp cứu hạ hoặc tăng đường huyết." },
  { name: "HAV Ab test nhanh", price: 130500, prep: "Không cần nhịn ăn trước khi lấy máu xét nghiệm.", desc: "Xét nghiệm định tính kháng thể kháng vi-rút Viêm gan A trong máu giúp xác định tình trạng nhiễm hoặc miễn dịch với viêm gan A." },
  { name: "HBsAg test nhanh", price: 58600, prep: "Không bắt buộc nhịn ăn. Lấy máu tĩnh mạch hoặc mao mạch.", desc: "Xét nghiệm định tính kháng nguyên bề mặt virus Viêm gan B, phương pháp sàng lọc đầu tay phát hiện nhiễm virus Viêm gan B." },
  { name: "HCV Ab test nhanh", price: 58600, prep: "Không bắt buộc nhịn ăn trước khi làm xét nghiệm.", desc: "Xét nghiệm test nhanh tìm kháng thể kháng virus Viêm gan C (Anti-HCV), dùng để sàng lọc bệnh nhân phơi nhiễm viêm gan C." },
  { name: "HIV Ab test nhanh", price: 58600, prep: "Tư vấn bảo mật trước xét nghiệm. Không cần chuẩn bị đặc biệt.", desc: "Xét nghiệm test nhanh sàng lọc kháng thể kháng vi-rút HIV trong máu, kết quả bảo mật và chính xác." },
  { name: "Test ma túy đá Methamphetamine", price: 44800, prep: "Lấy mẫu nước tiểu tươi trực tiếp vào cốc nghiệm của cơ sở y tế.", desc: "Xét nghiệm định tính phát hiện chất ma túy đá (Methamphetamine) kích thích thần kinh bài tiết trong nước tiểu." },
  { name: "Tìm ký sinh trùng sốt rét trong máu (bằng phương pháp thủ công)", price: 39700, prep: "Lấy máu ngoại vi tốt nhất vào thời điểm bệnh nhân đang lên cơn sốt hoặc rét run.", desc: "Kỹ thuật kéo giọt máu đặc và giọt mỏng nhuộm Giemsa, soi kính hiển vi tìm ký sinh trùng sốt rét Plasmodium." },
  { name: "Tổng phân tích nước tiểu (Bằng máy tự động)", price: 28600, prep: "Vệ sinh sạch bộ phận sinh dục ngoài, bỏ giọt nước tiểu đầu dòng và hứng nước tiểu giữa dòng vào cốc đựng mẫu.", desc: "Phân tích tự động 10 - 11 thông số nước tiểu giúp phát hiện nhiễm trùng đường tiểu, bệnh lý thận và đái tháo đường." },
  { name: "Tổng phân tích tế bào máu ngoại vi (bằng máy đếm tổng trở)", price: 43500, prep: "Nên nhịn ăn sáng trước khi lấy máu để các chỉ số tế bào máu đạt độ ổn định cao nhất.", desc: "Đếm tự động các dòng hồng cầu, bạch cầu, tiểu cầu, nồng độ hemoglobin nhằm chẩn đoán thiếu máu, nhiễm trùng, xuất huyết." },
  { name: "Vi nấm soi tươi", price: 45500, prep: "Không bôi thuốc mỡ, kem chống nấm hoặc dung dịch sát trùng lên vùng da tổn thương trong vòng 24 - 48 giờ trước khi cạo vảy.", desc: "Cạo vảy da, móng hoặc dịch tiết xử lý dung dịch KOH soi kính hiển vi tìm sợi tơ nấm, bào tử nấm gây bệnh ngoài da." }
];

const RAW_KHAM_BENH = [
  { name: "Khám bệnh", price: 39800, prep: "Mang theo Thẻ BHYT, CCCD gắn chip và sổ khám bệnh / đơn thuốc cũ (nếu có).", desc: "Bác sĩ chuyên khoa trực tiếp hỏi bệnh sử, khám lâm sàng toàn diện, đưa ra chẩn đoán, chỉ định cận lâm sàng và kê đơn điều trị." },
  { name: "Khám sức khỏe đi làm, đi học, lái xe (chưa tính xét nghiệm, cận lâm sàng)", price: 160000, prep: "Mang theo 02 ảnh 4x6 (nền trắng chụp trong 6 tháng gần nhất), CCCD và hồ sơ khám sức khỏe theo mẫu quy định.", desc: "Khám thể lực và các chuyên khoa theo mẫu quy chuẩn của Bộ Y tế (Nội, Ngoại, Mắt, Tai Mũi Họng, Răng Hàm Mặt, Thần kinh) phục vụ xin việc, nhập học hoặc lái xe." }
];

const RAW_CHAN_DOAN_HINH_ANH = [
  { name: "Chọc tháo dịch màng phổi dưới hướng dẫn của siêu âm", price: 195900, prep: "Người bệnh ngồi tư thế ôm gối hoặc tựa lưng ghế. Giữ yên tư thế và hít thở nhẹ nhàng theo hướng dẫn của bác sĩ.", desc: "Thủ thuật can thiệp chọc hút giải áp dịch khoang màng phổi dưới định vị siêu âm thời gian thực, đảm bảo an toàn và tránh biến chứng tổn thương nhu mô phổi." },
  { name: "Chụp X-quang Blondeau [số hóa 1 phim]", price: 73300, prep: "Tháo bỏ khuyên tai, dây chuyền, kẹp tóc kim loại hoặc kính mắt trước khi vào phòng chụp.", desc: "Kỹ thuật chụp X-quang tư thế Blondeau (mũi cằm chạm phim) khảo sát tình trạng viêm xoang hàm, xoang trán và cấu trúc hốc mũi." },
  { name: "Chụp X-quang Blondeau [số hóa 2 phim]", price: 105300, prep: "Tháo bỏ trang sức kim loại vùng đầu mặt cổ trước khi chụp.", desc: "Chụp X-quang tư thế Blondeau 2 bình diện/tư thế số hóa giúp khảo sát toàn diện hệ thống xoang trước và vách ngăn mũi." },
  { name: "Chụp X-quang bụng không chuẩn bị thẳng hoặc nghiêng [số hóa 1 phim]", price: 73300, prep: "Cởi bỏ thắt lưng, cúc áo kim loại vùng bụng. Không cần nhịn ăn trong trường hợp cấp cứu.", desc: "Chụp X-quang bụng tổng quát giúp phát hiện các tình trạng cấp cứu bụng ngoại khoa như liềm hơi dưới hoành (thủng tạng rỗng), mức nước hơi (tắc ruột) hoặc sỏi cản quang hệ tiết niệu." },
  { name: "Chụp X-quang bụng không chuẩn bị thẳng hoặc nghiêng [số hóa 2 phim]", price: 105300, prep: "Tháo các vật kim loại quanh thắt lưng và hông trước khi chụp.", desc: "Chụp X-quang bụng ở 2 tư thế (đứng và nằm/nghiêng) nhằm đánh giá chi tiết tình trạng tắc ruột, thủng tạng rỗng và phân bố hơi trong lòng ruột." },
  { name: "Chụp X-quang cột sống cổ C1-C2 [số hóa 1 phim]", price: 73300, prep: "Tháo vòng cổ, hoa tai, răng giả tháo lắp trước khi chụp. Giữ thẳng cổ và há miệng theo hiệu lệnh của kỹ thuật viên.", desc: "Chụp X-quang tư thế mỏm nha (chụp qua miệng há) khảo sát đốt sống cổ C1 (đốt đội) và C2 (đốt trục), phát hiện trật khớp đội trục hoặc gãy mỏm nha sau chấn thương." },
  { name: "Chụp X-quang cột sống cổ C1-C2 [số hóa 2 phim]", price: 105300, prep: "Tháo bỏ trang sức kim loại vùng cổ mặt trước khi chụp.", desc: "Chụp X-quang cột sống cổ cao C1-C2 ở 2 bình diện số hóa đánh giá chi tiết tổn thương xương và khe khớp sau chấn thương vùng cổ." },
  { name: "Chụp X-quang cột sống cổ chếch hai bên [số hóa 1 phim]", price: 73300, prep: "Tháo dây chuyền, khuyên tai trước khi chụp.", desc: "Chụp X-quang cột sống cổ tư thế chếch 3/4 nhằm bộc lộ rõ các lỗ tiếp hợp (lỗ ghép), phát hiện hẹp lỗ ghép chèn ép rễ thần kinh cánh tay." },
  { name: "Chụp X-quang cột sống cổ chếch hai bên [số hóa 2 phim]", price: 105300, prep: "Tháo bỏ trang sức kim loại vùng cổ.", desc: "Chụp X-quang cột sống cổ chếch 2 bên (trái và phải) số hóa, đánh giá toàn diện lỗ ghép và mỏm gai hai bên." },
  { name: "Chụp X-quang cột sống cổ thẳng nghiêng [số hóa 1 phim]", price: 73300, prep: "Tháo trang sức kim loại ở cổ và tai trước khi chụp.", desc: "Chụp X-quang cột sống cổ tư thế thẳng hoặc nghiêng nhằm đánh giá đường cong sinh lý, thoái hóa đốt sống cổ, gai xương và hẹp khe đĩa đệm." },
  { name: "Chụp X-quang cột sống cổ thẳng nghiêng [số hóa 2 phim]", price: 105300, prep: "Tháo trang sức kim loại vùng cổ và áo có cúc kim loại.", desc: "Chụp X-quang cột sống cổ đủ 2 tư thế thẳng và nghiêng số hóa sắc nét, khảo sát hoàn chỉnh trục cột sống cổ và các đốt sống C1 - C7." },
  { name: "Chụp X-quang cột sống cùng cụt thẳng nghiêng [số hóa 1 phim]", price: 73300, prep: "Nên đi đại tiện trước khi chụp để hạn chế bóng hơi phân cản quang.", desc: "Chụp X-quang vùng xương cùng cụt phát hiện nứt gãy sau chấn thương ngã dập mông, thoái hóa hoặc viêm khớp cùng chậu." },
  { name: "Chụp X-quang cột sống cùng cụt thẳng nghiêng [số hóa 2 phim]", price: 105300, prep: "Cởi bỏ trang sức, thắt lưng và nút bấm kim loại quanh hông.", desc: "Chụp X-quang vùng xương cùng cụt 2 tư thế thẳng và nghiêng số hóa, đánh giá góc nghiêng xương cụt và tổn thương xương cùng." },
  { name: "Chụp X-quang cột sống ngực thẳng nghiêng hoặc chếch [số hóa 1 phim]", price: 73300, prep: "Cởi áo lót có gọng kim loại, dây chuyền trước khi chụp.", desc: "Chụp X-quang đoạn cột sống ngực (D1 - D12) phát hiện gù vẹo cột sống, xẹp lún đốt sống do loãng xương hoặc thoái hóa cột sống ngực." },
  { name: "Chụp X-quang cột sống ngực thẳng nghiêng hoặc chếch [số hóa 2 phim]", price: 105300, prep: "Cởi bỏ áo ngực có gọng kim loại và dây chuyền.", desc: "Chụp X-quang cột sống ngực 2 bình diện thẳng và nghiêng số hóa, khảo sát toàn diện hình thái thân đốt sống và khe liên đốt sống ngực." },
  { name: "Chụp X-quang cột sống thắt lưng chếch hai bên [số hóa 1 phim]", price: 73300, prep: "Cởi bỏ thắt lưng và cúc kim loại vùng hông.", desc: "Chụp X-quang cột sống thắt lưng tư thế chếch bộc lộ cấu trúc eo đốt sống (dấu hiệu chú chó Lachapèle), chẩn đoán gãy hở eo và trượt đốt sống." },
  { name: "Chụp X-quang cột sống thắt lưng chếch hai bên [số hóa 2 phim]", price: 105300, prep: "Tháo thắt lưng, cởi quần áo có kim loại quanh eo hông.", desc: "Chụp X-quang cột sống thắt lưng chếch 2 bên (trái và phải) số hóa, đánh giá toàn diện eo đốt sống và lỗ tiếp hợp hai bên." },
  { name: "Chụp X-quang cột sống thắt lưng động, gập ưỡn [số hóa 1 phim]", price: 73300, prep: "Thực hiện theo tư thế cúi gập người hoặc ưỡn người tối đa dưới sự hướng dẫn của kỹ thuật viên.", desc: "Chụp X-quang cột sống thắt lưng động nhằm đánh giá độ vững và sự di lệch mất vững của các đốt sống khi vận động cột sống." },
  { name: "Chụp X-quang cột sống thắt lưng động, gập ưỡn [số hóa 2 phim]", price: 105300, prep: "Tập gập và ưỡn thân người theo hiệu lệnh của kỹ thuật viên X-quang.", desc: "Chụp X-quang động cột sống thắt lưng ở 2 trạng thái gập tối đa và ưỡn tối đa số hóa, phát hiện trượt đốt sống động và mất vững cột sống." },
  { name: "Chụp X-quang cột sống thắt lưng L5-S1 thẳng nghiêng [số hóa 1 phim]", price: 73300, prep: "Tháo thắt lưng và đồ kim loại quanh thắt lưng.", desc: "Chụp X-quang tập trung vào khớp bản lề thắt lưng cùng L5-S1, nơi chịu lực lớn nhất và dễ bị thoái hóa, trượt đốt sống hoặc hẹp đĩa đệm." },
  { name: "Chụp X-quang cột sống thắt lưng L5-S1 thẳng nghiêng [số hóa 2 phim]", price: 105300, prep: "Cởi bỏ thắt lưng và trang sức kim loại quanh thắt lưng.", desc: "Chụp X-quang khớp thắt lưng cùng L5-S1 ở 2 tư thế thẳng và nghiêng số hóa, đánh giá chi tiết độ thoái hóa và sự trượt thân đốt sống." },
  { name: "Chụp X-quang cột sống thắt lưng thẳng nghiêng [số hóa 1 phim]", price: 73300, prep: "Tháo thắt lưng và các vật kim loại vùng bụng hông.", desc: "Chụp X-quang cột sống thắt lưng phát hiện gai xương, thoái hóa cột sống, lún xẹp thân đốt sống thắt lưng và hẹp khe gian đốt." },
  { name: "Chụp X-quang cột sống thắt lưng thẳng nghiêng [số hóa 2 phim]", price: 105300, prep: "Tháo thắt lưng, trang sức kim loại vùng bụng và hông.", desc: "Chụp X-quang cột sống thắt lưng đủ 2 tư thế thẳng và nghiêng số hóa, khảo sát toàn diện trục cột sống thắt lưng từ L1 đến L5." },
  { name: "Chụp X-quang đỉnh phổi ưỡn [số hóa 1 phim]", price: 73300, prep: "Người bệnh đứng ưỡn ngực theo tư thế chuyên biệt để tách xương đòn khỏi đỉnh phổi.", desc: "Chụp X-quang đỉnh phổi tư thế ưỡn nhằm bộc lộ rõ vùng đỉnh phổi, tránh bóng cản quang của xương đòn và xương sườn để phát hiện tổn thương lao đỉnh phổi hoặc khối u Pancoast." },
  { name: "Chụp X-quang hàm chếch một bên [số hóa 1 phim]", price: 73300, prep: "Tháo răng giả tháo lắp, khuyên tai, vòng cổ trước khi chụp.", desc: "Chụp X-quang xương hàm dưới tư thế chếch khảo sát gãy cành ngang, cành cao hoặc góc hàm dưới sau chấn thương vùng mặt." },
  { name: "Chụp X-quang Hirtz [số hóa 1 phim]", price: 73300, prep: "Ngửa cổ tối đa theo hướng dẫn. Tháo bỏ trang sức kim loại vùng đầu cổ.", desc: "Chụp X-quang sọ tư thế Hirtz (chụp từ đỉnh đầu xuống nền sọ) khảo sát các xoang sau (xoang sàng sau, xoang bướm) và vòm nền sọ." },
  { name: "Chụp X-quang hố yên thẳng hoặc nghiêng [số hóa 1 phim]", price: 73300, prep: "Tháo bỏ kính mắt, khuyên tai, kẹp tóc kim loại.", desc: "Chụp X-quang tập trung vào vùng hố yên xương bướm, phát hiện tình trạng giãn rộng hoặc mòn mỏm yên do u tuyến yên chèn ép." },
  { name: "Chụp X-quang hốc mắt thẳng nghiêng [số hóa 1 phim]", price: 73300, prep: "Tháo kính mắt, lông mi giả hoặc đồ kim loại quanh vùng mắt.", desc: "Chụp X-quang hốc mắt phát hiện vỡ bờ hốc mắt, dị vật cản quang trong nhãn cầu sau tai nạn chấn thương mắt." },
  { name: "Chụp X-quang hốc mắt thẳng nghiêng [số hóa 2 phim]", price: 105300, prep: "Tháo bỏ trang sức, phụ kiện kim loại vùng đầu mặt.", desc: "Chụp X-quang hốc mắt 2 tư thế thẳng và nghiêng số hóa, xác định chính xác vị trí dị vật cản quang và tổn thương thành hốc mắt." },
  { name: "Chụp X-quang khớp cùng chậu thẳng chếch hai bên [số hóa 3 phim]", price: 130300, prep: "Đi đại tiện trước khi chụp nếu có thể để lòng trực tràng thông thoáng.", desc: "Chụp X-quang khớp cùng chậu ở 3 tư thế (thẳng và chếch 2 bên) số hóa, là tiêu chuẩn chẩn đoán viêm cột sống dính khớp và thoái hóa khớp cùng chậu." },
  { name: "Chụp X-quang khớp gối thẳng, nghiêng hoặc chếch [số hóa 1 phim]", price: 73300, prep: "Kéo ống quần lên cao quá gối hoặc thay váy áo bệnh nhân.", desc: "Chụp X-quang khớp gối đánh giá gai khớp, hẹp khe khớp, thoái hóa khớp gối hoặc gãy rạn xương bánh chè, mâm chày." },
  { name: "Chụp X-quang khớp gối thẳng, nghiêng hoặc chếch [số hóa 2 phim]", price: 105300, prep: "Bộc lộ vùng khớp gối, tháo bỏ nẹp bảo hộ kim loại.", desc: "Chụp X-quang khớp gối đủ 2 tư thế thẳng và nghiêng số hóa, đánh giá toàn diện diện khớp đùi - chày và khớp đùi - bánh chè." },
  { name: "Chụp X-quang khớp háng nghiêng [số hóa 1 phim]", price: 73300, prep: "Cởi bỏ thắt lưng và cúc kim loại quanh vùng khớp háng.", desc: "Chụp X-quang khớp háng tư thế nghiêng đánh giá chỏm xương đùi, ổ cối và khe khớp háng theo chiều trước sau." },
  { name: "Chụp X-quang khớp háng thẳng hai bên [số hóa 1 phim]", price: 73300, prep: "Nằm thẳng ngửa, hai bàn chân hơi xoay vào trong theo hướng dẫn.", desc: "Chụp X-quang khung chậu lấy khớp háng hai bên so sánh đối xứng, chẩn đoán hoại tử vô mạch chỏm xương đùi, thoái hóa khớp háng hoặc gãy cổ xương đùi." },
  { name: "Chụp X-quang khớp khuỷu gập (Jones hoặc Coyle) [số hóa 1 phim]", price: 73300, prep: "Bộc lộ cánh tay và cẳng tay, giữ tư thế khuỷu gập theo hướng dẫn.", desc: "Chụp X-quang khớp khuỷu tư thế gấp đặc biệt giúp bộc lộ rõ mỏm vẹt, đài quay và lồi cầu cánh tay sau chấn thương." },
  { name: "Chụp X-quang khớp khuỷu thẳng, nghiêng hoặc chếch [số hóa 1 phim]", price: 73300, prep: "Bộc lộ vùng khớp khuỷu, tháo đồng hồ, lắc tay.", desc: "Chụp X-quang khớp khuỷu khảo sát gãy mỏm khuỷu, trật khớp khuỷu hoặc thoái hóa diện khớp khuỷu tay." },
  { name: "Chụp X-quang khớp khuỷu thẳng, nghiêng hoặc chếch [số hóa 2 phim]", price: 105300, prep: "Bộc lộ vùng khuỷu tay, tháo trang sức kim loại.", desc: "Chụp X-quang khớp khuỷu đủ 2 tư thế thẳng và nghiêng số hóa, đánh giá hoàn chỉnh cấu trúc xương vùng khuỷu tay." },
  { name: "Chụp X-quang khớp thái dương hàm [số hóa 1 phim]", price: 73300, prep: "Tháo răng giả, khuyên tai, kẹp tóc. Giữ há miệng hoặc ngậm miệng theo yêu cầu.", desc: "Chụp X-quang khớp thái dương hàm khảo sát lồi cầu xương hàm dưới trong hố thái dương khi ngậm và há miệng, chẩn đoán rối loạn khớp thái dương hàm." },
  { name: "Chụp X-quang khớp ức đòn thẳng chếch [số hóa 1 phim]", price: 73300, prep: "Cởi bỏ dây chuyền và áo ngực có gọng kim loại.", desc: "Chụp X-quang khớp ức đòn phát hiện trật khớp ức đòn ra trước hoặc ra sau, viêm khớp ức đòn sau chấn thương." },
  { name: "Chụp X-quang khớp ức đòn thẳng chếch [số hóa 2 phim]", price: 105300, prep: "Tháo bỏ trang sức kim loại vùng ngực cổ.", desc: "Chụp X-quang khớp ức đòn ở 2 bình diện thẳng và chếch số hóa, đánh giá chi tiết khớp giữa đầu trong xương đòn và cán xương ức." },
  { name: "Chụp X-quang khớp vai nghiêng hoặc chếch [số hóa 1 phim]", price: 73300, prep: "Tháo dây chuyền, cởi áo có cúc kim loại bên vai chụp.", desc: "Chụp X-quang khớp vai tư thế nghiêng (tư thế chữ Y ổ chảo) giúp chẩn đoán trật khớp vai ra trước hoặc ra sau." },
  { name: "Chụp X-quang khớp vai thẳng [số hóa 1 phim]", price: 73300, prep: "Bộc lộ vùng khớp vai cần chụp, tháo trang sức kim loại.", desc: "Chụp X-quang khớp vai thẳng khảo sát chỏm xương cánh tay, ổ chảo, mỏm cùng vai và gãy đầu trên xương cánh tay." },
  { name: "Chụp X-quang khớp vai thẳng [số hóa 2 phim]", price: 105300, prep: "Tháo bỏ trang sức và phụ kiện kim loại vùng vai ngực.", desc: "Chụp X-quang khớp vai ở 2 tư thế (xoay trong và xoay ngoài) số hóa, đánh giá toàn diện vôi hóa gân cơ chóp xoay và tổn thương xương khớp vai." },
  { name: "Chụp X-quang khung chậu thẳng [số hóa 1 phim]", price: 73300, prep: "Cởi bỏ thắt lưng và nút kim loại quần áo quanh vùng chậu.", desc: "Chụp X-quang toàn bộ khung chậu giúp phát hiện gãy vỡ cánh chậu, trật khớp mu, gãy ngành ngồi mu hoặc tổn thương khớp háng hai bên." },
  { name: "Chụp X-quang mặt thẳng nghiêng [số hóa 1 phim]", price: 73300, prep: "Tháo khuyên tai, kẹp tóc, kính mắt và răng giả tháo lắp trước khi chụp.", desc: "Chụp X-quang khối xương mặt phát hiện gãy cung tiếp gò má, xương hàm trên hoặc vỡ khối xương tầng giữa mặt." },
  { name: "Chụp X-quang mặt thẳng nghiêng [số hóa 2 phim]", price: 105300, prep: "Tháo bỏ phụ kiện kim loại vùng đầu mặt.", desc: "Chụp X-quang khối xương mặt 2 tư thế thẳng và nghiêng số hóa, đánh giá toàn diện tổn thương chấn thương hàm mặt." },
  { name: "Chụp X-quang mặt thấp hoặc mặt cao [số hóa 1 phim]", price: 73300, prep: "Giữ đầu bất động theo tư thế kỹ thuật viên hướng dẫn.", desc: "Kỹ thuật chụp X-quang góc mặt chuyên biệt khảo sát tầng trên hoặc tầng dưới khối xương mặt." },
  { name: "Chụp X-quang mỏm trâm [số hóa 1 phim]", price: 73300, prep: "Tháo khuyên tai và dây chuyền.", desc: "Chụp X-quang khảo sát chiều dài mỏm trâm xương thái dương, chẩn đoán hội chứng Eagle (mỏm trâm quá dài gây đau họng, nuốt vướng)." },
  { name: "Chụp X-quang ngực nghiêng hoặc chếch mỗi bên [số hóa 1 phim]", price: 73300, prep: "Cởi áo lót có gọng kim loại, hít sâu nín thở khi có hiệu lệnh chụp.", desc: "Chụp X-quang phổi tư thế nghiêng giúp xác định chính xác tổn thương nằm ở thùy phổi nào, trung thất trước, giữa hay sau." },
  { name: "Chụp X-quang ngực thẳng [số hóa 1 phim]", price: 73300, prep: "Cởi áo lót có gọng kim loại, dây chuyền. Đứng áp sát ngực vào phim, hít sâu và nín thở vài giây khi chụp.", desc: "Kỹ thuật chẩn đoán hình ảnh cơ bản và quan trọng nhất đánh giá nhu mô phổi, bóng tim, quai động mạch chủ, màng phổi và khung xương lồng ngực." },
  { name: "Chụp X-quang ngực thẳng [số hóa 2 phim]", price: 105300, prep: "Cởi bỏ trang sức và phụ kiện kim loại vùng ngực.", desc: "Chụp X-quang ngực đủ 2 bình diện thẳng và nghiêng số hóa sắc nét, khảo sát hoàn chỉnh các góc sườn hoành và khoảng sáng sau tim." },
  { name: "Chụp X-quang sọ thẳng/nghiêng [số hóa 1 phim]", price: 73300, prep: "Tháo bỏ kẹp tóc kim loại, khuyên tai, kính mắt trước khi chụp.", desc: "Chụp X-quang hộp sọ phát hiện nứt rạn xương vòm sọ, lún sọ hoặc các vôi hóa nội sọ sau chấn thương đầu." },
  { name: "Chụp X-quang sọ thẳng/nghiêng [số hóa 2 phim]", price: 105300, prep: "Tháo bỏ trang sức, kẹp tóc kim loại vùng đầu.", desc: "Chụp X-quang hộp sọ đủ 2 tư thế thẳng và nghiêng số hóa, đánh giá toàn diện vòm sọ và nền sọ." },
  { name: "Chụp X-quang tại giường", price: 73300, prep: "Thực hiện trực tiếp tại giường bệnh đối với bệnh nhân nặng, hôn mê hoặc không thể di chuyển.", desc: "Sử dụng máy chụp X-quang di động kỹ thuật số chụp tại phòng bệnh cấp cứu/hồi sức, theo dõi tình trạng tràn khí, tràn dịch màng phổi hoặc đặt ống nội khí quản." },
  { name: "Chụp X-quang xương bả vai thẳng nghiêng [số hóa 1 phim]", price: 73300, prep: "Bộc lộ vùng vai bên tổn thương, tháo trang sức kim loại.", desc: "Chụp X-quang xương bả vai phát hiện nứt gãy thân xương bả vai, mỏm cùng vai hoặc gai vai sau chấn thương trực tiếp." },
  { name: "Chụp X-quang xương bả vai thẳng nghiêng [số hóa 2 phim]", price: 105300, prep: "Tháo bỏ trang sức kim loại vùng vai cổ.", desc: "Chụp X-quang xương bả vai 2 tư thế thẳng và nghiêng số hóa, đánh giá chi tiết tổn thương xương và ổ chảo." },
  { name: "Chụp X-quang xương bàn ngón tay thẳng, nghiêng hoặc chếch [số hóa 1 phim]", price: 73300, prep: "Tháo nhẫn, vòng tay ở bàn tay cần chụp.", desc: "Chụp X-quang bàn tay phát hiện gãy trật các xương bàn ngón tay, đốt ngón tay hoặc dị vật cản quang ở bàn tay." },
  { name: "Chụp X-quang xương bàn ngón tay thẳng, nghiêng hoặc chếch [số hóa 2 phim]", price: 105300, prep: "Tháo nhẫn và vòng tay.", desc: "Chụp X-quang xương bàn ngón tay đủ 2 tư thế thẳng và chếch số hóa, khảo sát chi tiết trục các ngón tay và diện khớp." },
  { name: "Chụp X-quang xương bàn, ngón chân thẳng, nghiêng hoặc chếch [số hóa 1 phim]", price: 73300, prep: "Cởi giày tất ở bàn chân cần chụp.", desc: "Chụp X-quang bàn chân phát hiện gãy xương đốt bàn, ngón chân, nứt xương hoặc thoái hóa các khớp bàn ngón chân." },
  { name: "Chụp X-quang xương bàn, ngón chân thẳng, nghiêng hoặc chếch [số hóa 2 phim]", price: 105300, prep: "Cởi bỏ giày tất và trang sức ở ngón chân.", desc: "Chụp X-quang xương bàn ngón chân 2 tư thế thẳng và chếch số hóa, đánh giá toàn diện cung vòm bàn chân và các xương ngón chân." },
  { name: "Chụp X-quang xương bánh chè và khớp đùi bánh chè [số hóa 1 phim]", price: 73300, prep: "Bộc lộ vùng đầu gối, giữ tư thế gấp gối theo hướng dẫn.", desc: "Chụp X-quang tư thế tiếp tuyến bánh chè khảo sát khe khớp đùi bánh chè, phát hiện nứt gãy dọc xương bánh chè và thoái hóa diện khớp." },
  { name: "Chụp X-quang xương bánh chè và khớp đùi bánh chè [số hóa 2 phim]", price: 105300, prep: "Kéo ống quần lên cao bộc lộ khớp gối.", desc: "Chụp X-quang xương bánh chè ở 2 góc gập gối số hóa, đánh giá sự di lệch và độ vững của xương bánh chè." },
  { name: "Chụp X-quang xương cẳng chân thẳng nghiêng [số hóa 1 phim]", price: 73300, prep: "Kéo ống quần qua gối, tháo lắc chân nếu có.", desc: "Chụp X-quang cẳng chân khảo sát thân xương chày và xương mác, phát hiện gãy xương, can xương hoặc u xương cẳng chân." },
  { name: "Chụp X-quang xương cẳng chân thẳng nghiêng [số hóa 2 phim]", price: 105300, prep: "Bộc lộ toàn bộ cẳng chân từ gối xuống cổ chân.", desc: "Chụp X-quang xương cẳng chân đủ 2 tư thế thẳng và nghiêng số hóa, lấy trọn vẹn 2 khớp (khớp gối và khớp cổ chân)." },
  { name: "Chụp X-quang xương cẳng tay thẳng nghiêng [số hóa 1 phim]", price: 73300, prep: "Tháo đồng hồ, vòng tay ở tay cần chụp.", desc: "Chụp X-quang xương cẳng tay khảo sát thân xương quay và xương trụ, phát hiện gãy xương Monteggia hoặc Galeazzi." },
  { name: "Chụp X-quang xương cẳng tay thẳng nghiêng [số hóa 2 phim]", price: 105300, prep: "Bộc lộ cánh cẳng tay, tháo trang sức.", desc: "Chụp X-quang xương cẳng tay đủ 2 tư thế thẳng và nghiêng số hóa, lấy trọn khớp khuỷu và khớp cổ tay." },
  { name: "Chụp X-quang xương cánh tay thẳng nghiêng [số hóa 1 phim]", price: 73300, prep: "Cởi áo bộc lộ vùng cánh tay cần chụp.", desc: "Chụp X-quang xương cánh tay khảo sát thân xương cánh tay, phát hiện gãy xương, nang xương hoặc tổn thương sau chấn thương." },
  { name: "Chụp X-quang xương cánh tay thẳng nghiêng [số hóa 2 phim]", price: 105300, prep: "Bộc lộ vùng cánh tay từ vai xuống khuỷu.", desc: "Chụp X-quang xương cánh tay đủ 2 tư thế thẳng và nghiêng số hóa, lấy đủ khớp vai và khớp khuỷu." },
  { name: "Chụp X-quang xương chính mũi nghiêng hoặc tiếp tuyến [số hóa 1 phim]", price: 73300, prep: "Tháo kính mắt, khuyên mũi nếu có.", desc: "Chụp X-quang xương chính mũi tư thế nghiêng đặc biệt phát hiện lún, gãy rời xương chính mũi sau va đập vùng mặt." },
  { name: "Chụp X-quang xương cổ chân thẳng, nghiêng hoặc chếch [số hóa 1 phim]", price: 73300, prep: "Cởi giày tất, tháo lắc chân.", desc: "Chụp X-quang cổ chân phát hiện gãy mắt cá trong, mắt cá ngoài, trật mộng chày mác hoặc tổn thương xương sên." },
  { name: "Chụp X-quang xương cổ chân thẳng, nghiêng hoặc chếch [số hóa 2 phim]", price: 105300, prep: "Bộc lộ vùng cổ chân cần chụp.", desc: "Chụp X-quang xương cổ chân đủ 2 tư thế thẳng và nghiêng số hóa, đánh giá toàn diện gọng chày mác và khe khớp cổ chân." },
  { name: "Chụp X-quang xương cổ tay thẳng, nghiêng hoặc chếch [số hóa 1 phim]", price: 73300, prep: "Tháo đồng hồ, lắc tay trước khi chụp.", desc: "Chụp X-quang cổ tay phát hiện gãy đầu dưới xương quay (gãy Pouteau-Colles), gãy xương thuyền hoặc trật khớp cổ tay." },
  { name: "Chụp X-quang xương cổ tay thẳng, nghiêng hoặc chếch [số hóa 2 phim]", price: 105300, prep: "Tháo bỏ vòng tay, đồng hồ kim loại.", desc: "Chụp X-quang xương cổ tay đủ 2 tư thế thẳng và nghiêng số hóa, khảo sát chi tiết khối 8 xương cổ tay." },
  { name: "Chụp X-quang xương đòn thẳng hoặc chếch [số hóa 1 phim]", price: 73300, prep: "Tháo dây chuyền và cởi áo có cúc kim loại.", desc: "Chụp X-quang xương đòn phát hiện gãy 1/3 trong, 1/3 giữa hoặc 1/3 ngoài xương đòn sau tai nạn va đập vai." },
  { name: "Chụp X-quang xương đùi thẳng nghiêng [số hóa 1 phim]", price: 73300, prep: "Cởi quần áo dài có cúc kim loại, mặc váy áo chụp chuyên dụng.", desc: "Chụp X-quang xương đùi phát hiện gãy thân xương đùi, nứt xương hoặc u xương đùi." },
  { name: "Chụp X-quang xương đùi thẳng nghiêng [số hóa 2 phim]", price: 105300, prep: "Bộc lộ toàn bộ vùng đùi bên tổn thương.", desc: "Chụp X-quang xương đùi đủ 2 tư thế thẳng và nghiêng số hóa, lấy trọn vẹn khớp háng và khớp gối." },
  { name: "Chụp X-quang xương gót thẳng nghiêng [số hóa 1 phim]", price: 73300, prep: "Cởi giày tất ở chân cần chụp.", desc: "Chụp X-quang xương gót phát hiện gai xương gót, gãy vỡ xương gót (đo góc Bohler) sau khi ngã từ trên cao xuống." },
  { name: "Chụp X-quang xương gót thẳng nghiêng [số hóa 2 phim]", price: 105300, prep: "Cởi bỏ tất và trang sức ở cổ chân.", desc: "Chụp X-quang xương gót đủ 2 tư thế thẳng và nghiêng số hóa, đánh giá toàn diện thân xương gót và khớp sên - gót." },
  { name: "Chụp X-quang xương ức thẳng, nghiêng [số hóa 1 phim]", price: 73300, prep: "Cởi bỏ áo ngực có gọng kim loại và dây chuyền.", desc: "Chụp X-quang xương ức tư thế nghiêng hoặc chếch phát hiện nứt gãy cán ức, thân ức sau va đập mạnh lồng ngực." },
  { name: "Chụp X-quang xương ức thẳng, nghiêng [số hóa 2 phim]", price: 105300, prep: "Tháo bỏ trang sức kim loại vùng ngực.", desc: "Chụp X-quang xương ức 2 bình diện thẳng và nghiêng số hóa, khảo sát chi tiết bờ xương ức và sụn sườn kết nối." },
  { name: "Điện tim thường", price: 39900, prep: "Nằm ngửa thả lỏng, không nói chuyện hoặc cử động trong 1 - 2 phút khi ghi điện tim. Tháo đồng hồ kim loại.", desc: "Ghi lại hoạt động điện thế của tim qua 12 chuyển đạo (ECG tiêu chuẩn), giúp phát hiện rối loạn nhịp tim, thiếu máu cục bộ cơ tim, nhồi máu cơ tim và phì đại tâm thất." },
  { name: "Nội soi tai mũi họng", price: 116100, prep: "Ngồi thẳng lưng, hít thở đều bằng miệng theo hướng dẫn của bác sĩ. Không giật mình hoặc lắc đầu.", desc: "Sử dụng ống nội soi mềm/cứng có gắn camera độ phân giải cao quan sát trực tiếp niêm mạc ống tai, màng nhĩ, hốc mũi, vòm họng, thanh quản phát hiện viêm, polyp, dị vật hoặc khối u." },
  { name: "Nội soi thực quản, dạ dày, tá tràng", price: 276500, prep: "Bắt buộc nhịn ăn ít nhất 6 - 8 giờ trước khi nội soi (chỉ uống ít nước lọc trước 2 giờ). Thông báo cho bác sĩ các bệnh lý tim mạch, huyết áp.", desc: "Đưa ống nội soi mềm qua đường miệng vào lòng thực quản, dạ dày, hành tá tràng để quan sát trực tiếp các vết loét, viêm xung huyết, polyp, chảy máu tiêu hóa hoặc tầm soát ung thư dạ dày sớm." },
  { name: "Siêu âm các tuyến nước bọt", price: 58600, prep: "Nằm ngửa bộc lộ vùng hàm và cổ.", desc: "Khảo sát cấu trúc nhu mô tuyến mang tai, tuyến dưới hàm hai bên; phát hiện viêm tuyến nước bọt, sỏi ống tuyến hoặc u tuyến mang tai." },
  { name: "Siêu âm cơ phần mềm vùng cổ mặt", price: 58600, prep: "Nằm ngửa bộc lộ vùng cổ mặt cần kiểm tra.", desc: "Đánh giá các khối sưng đau, u mỡ, nang bã, áp-xe hoặc tổn thương cơ vùng mặt cổ." },
  { name: "Siêu âm dẫn đường đặt catheter động mạch cấp cứu", price: 58600, prep: "Thực hiện tại phòng hồi sức cấp cứu dưới điều kiện vô khuẩn.", desc: "Ứng dụng siêu âm mạch máu trực tiếp dẫn đường chọc kim đặt ống thông động mạch theo dõi huyết áp động mạch liên tục." },
  { name: "Siêu âm dẫn đường đặt catheter tĩnh mạch cấp cứu", price: 58600, prep: "Thực hiện cấp cứu dưới hướng dẫn đầu dò siêu âm.", desc: "Siêu âm định vị chính xác tĩnh mạch cảnh trong, tĩnh mạch dưới đòn hoặc tĩnh mạch đùi để đặt đường truyền tĩnh mạch trung tâm an toàn." },
  { name: "Siêu âm doppler động mạch, tĩnh mạch chi dưới", price: 252300, prep: "Mặc quần rộng rãi hoặc váy bệnh nhân để dễ bộc lộ toàn bộ hai chân.", desc: "Đánh giá dòng chảy mạch máu, phát hiện suy giãn van tĩnh mạch chi dưới, huyết khối tĩnh mạch sâu hoặc xơ vữa hẹp tắc động mạch chân." },
  { name: "Siêu âm doppler mạch máu", price: 252300, prep: "Nằm thả lỏng trên giường siêu âm.", desc: "Khảo sát hình thái lòng mạch và phổ vận tốc dòng máu bằng hiệu ứng Doppler màu, chẩn đoán hẹp tắc mạch máu hoặc phình động mạch." },
  { name: "Siêu âm doppler tim", price: 252300, prep: "Nằm nghiêng trái bộc lộ ngực, hít thở đều và thả lỏng người.", desc: "Khảo sát kích thước các buồng tim, chức năng co bóp tống máu thất trái (EF), tình trạng hở/hẹp các van tim và áp lực động mạch phổi." },
  { name: "Siêu âm doppler tuyến vú", price: 89300, prep: "Bộc lộ vùng ngực hai bên, nằm ngửa giơ tay qua đầu.", desc: "Khảo sát cấu trúc mô tuyến vú kết hợp phổ mạch Doppler màu phân loại tổn thương theo thang điểm BI-RADS, tầm soát sớm u vú và ung thư vú." },
  { name: "Siêu âm hạch vùng cổ", price: 58600, prep: "Nằm ngửa hơi ngửa cổ.", desc: "Khảo sát số lượng, kích thước, ranh giới tủy vỏ và dòng mạch nuôi của các nhóm hạch cổ, phát hiện hạch viêm phản ứng hoặc hạch di căn ác tính." },
  { name: "Siêu âm hệ tiết niệu (thận, tuyến thượng thận, bàng quang, tiền liệt tuyến)", price: 58600, prep: "Uống khoảng 500ml - 1 lít nước lọc trước khi siêu âm 30 - 60 phút và nhịn tiểu để bàng quang căng vừa đủ.", desc: "Khảo sát hai thận (phát hiện sỏi thận, ứ nước, nang thận), bàng quang (sỏi bàng quang, u bàng quang) và đo thể tích tuyến tiền liệt ở nam giới." },
  { name: "Siêu âm khớp (gối, háng, khuỷu, cổ tay….)", price: 58600, prep: "Bộc lộ vùng khớp cần siêu âm.", desc: "Đánh giá tràn dịch ổ khớp, dày màng hoạt dịch, tổn thương gân cơ, sụn chêm và bao khớp trong các bệnh lý viêm khớp, thoái hóa khớp." },
  { name: "Siêu âm màng phổi cấp cứu", price: 58600, prep: "Bệnh nhân ngồi hoặc nằm tại giường cấp cứu.", desc: "Siêu âm nhanh tại giường phát hiện tràn dịch màng phổi, tràn khí màng phổi hoặc đông đặc phổi trong cấp cứu suy hô hấp." },
  { name: "Siêu âm ổ bụng", price: 58600, prep: "Nên nhịn ăn từ 6 - 8 tiếng trước siêu âm để túi mật căng to và dạ dày ruột ít sinh hơi. Uống nước nhịn tiểu nhẹ.", desc: "Khảo sát tổng thể gan, mật, tụy, lách, hai thận, bàng quang, tử cung - buồng trứng hoặc tiền liệt tuyến, phát hiện gan nhiễm mỡ, sỏi mật, sỏi thận, khối u ổ bụng." },
  { name: "Siêu âm ổ bụng tại giường cấp cứu", price: 58600, prep: "Thực hiện ngay tại giường cấp cứu theo phác đồ FAST.", desc: "Siêu âm cấp cứu tập trung phát hiện nhanh dịch tự do trong ổ bụng (máu, dịch) ở bệnh nhân chấn thương bụng kín hoặc cấp cứu bụng cấp." },
  { name: "Siêu âm phần mềm (da, tổ chức dưới da, cơ….)", price: 58600, prep: "Bộc lộ vùng da và cơ bắp cần thăm khám.", desc: "Đánh giá các tổn thương u bã đậu, u mỡ, rách cơ, tụ máu hoặc ổ áp-xe dưới da." },
  { name: "Siêu âm tại giường", price: 58600, prep: "Thực hiện trực tiếp tại giường đối với bệnh nhân nặng không thể di chuyển.", desc: "Sử dụng máy siêu âm di động đánh giá cơ quan đích tại buồng bệnh của bệnh nhân nội trú." },
  { name: "Siêu âm thai (thai, nhau thai, nước ối)", price: 58600, prep: "Uống nước nhịn tiểu nếu thai nhỏ dưới 12 tuần. Thai lớn hơn không cần nhịn tiểu.", desc: "Khảo sát sự phát triển của thai nhi, vị trí bám của bánh nhau, chỉ số ối (AFI) và tim thai." },
  { name: "Siêu âm thai nhi trong 3 tháng cuối", price: 58600, prep: "Mặc quần áo thoải mái, không cần nhịn tiểu.", desc: "Đánh giá ngôi thai, ước tính cân nặng thai nhi, độ trưởng thành bánh nhau và lượng nước ối chuẩn bị cho cuộc sinh nở." },
  { name: "Siêu âm thai nhi trong 3 tháng đầu", price: 58600, prep: "Uống 2 - 3 ly nước lọc trước khi siêu âm 30 phút để bàng quang căng đẩy tử cung lên rõ.", desc: "Xác định thai trong hay ngoài tử cung, số lượng túi thai, đo chiều dài đầu mông (CRL) và đo độ mờ da gáy tầm soát hội chứng Down." },
  { name: "Siêu âm thai nhi trong 3 tháng giữa", price: 58600, prep: "Mặc đồ rộng rãi, đi tiểu trước khi vào phòng siêu âm nếu bàng quang quá căng.", desc: "Siêu âm hình thái học chi tiết thai nhi từ tuần 18 - 22, tầm soát dị tật tim, não, mặt, cột sống và các cơ quan nội tạng." },
  { name: "Siêu âm tim cấp cứu tại giường", price: 252300, prep: "Thực hiện cấp cứu khẩn trương tại giường bệnh.", desc: "Siêu âm tim cấp cứu phát hiện tràn dịch màng ngoài tim ép tim cấp, rối loạn vận động vùng thành tim hoặc suy tim cấp." },
  { name: "Siêu âm tim, màng tim qua thành ngực", price: 252300, prep: "Nằm nghiêng trái bộc lộ ngực trái, giữ nhịp thở đều đặn.", desc: "Khảo sát toàn diện giải phẫu và huyết động học của tim, buồng tim, van tim và dịch màng ngoài tim." },
  { name: "Siêu âm tinh hoàn hai bên", price: 58600, prep: "Nằm ngửa bộc lộ vùng bìu.", desc: "Khảo sát cấu trúc nhu mô tinh hoàn, mào tinh hoàn hai bên; phát hiện viêm tinh hoàn, xoắn tinh hoàn, giãn tĩnh mạch thừng tinh hoặc tràn dịch màng tinh hoàn." },
  { name: "Siêu âm tử cung buồng trứng qua đường âm đạo", price: 195600, prep: "Bắt buộc đi tiểu sạch hết trước khi thực hiện siêu âm đầu dò âm đạo. Chỉ áp dụng cho phụ nữ đã có quan hệ tình dục.", desc: "Sử dụng đầu dò chuyên dụng tần số cao đưa vào âm đạo tiếp cận sát tử cung và buồng trứng, cho hình ảnh siêu âm rõ nét nhất chẩn đoán u xơ tử cung, đa nang buồng trứng, thai sớm hoặc lạc nội mạc tử cung." },
  { name: "Siêu âm tử cung buồng trứng qua đường bụng", price: 58600, prep: "Uống nhiều nước (khoảng 3 - 4 cốc nước lọc) trước 1 tiếng và nhịn tiểu căng bàng quang để quan sát rõ tử cung buồng trứng.", desc: "Siêu âm tổng quát vùng tiểu khung qua thành bụng khảo sát tử cung, nội mạc tử cung và hai buồng trứng." },
  { name: "Siêu âm tử cung phần phụ", price: 58600, prep: "Uống nước nhịn tiểu căng bàng quang trước khi khám.", desc: "Đánh giá tử cung, vòi trứng và buồng trứng hai bên nhằm phát hiện các bệnh lý phụ khoa như u buồng trứng, viêm ứ dịch vòi trứng." },
  { name: "Siêu âm tuyến giáp", price: 58600, prep: "Nằm ngửa kê gối dưới vai để ngửa cổ tối đa, tháo dây chuyền.", desc: "Khảo sát kích thước, nhu mô tuyến giáp hai thùy và eo giáp; phân loại nhân giáp theo thang điểm TIRADS tầm soát bướu cổ và ung thư tuyến giáp." },
  { name: "Siêu âm tuyến vú hai bên", price: 58600, prep: "Bộc lộ vùng ngực hai bên, thời điểm tốt nhất là sau khi sạch kinh 3 - 5 ngày.", desc: "Khảo sát nhu mô tuyến vú, ống dẫn sữa và các nang vú, u xơ tuyến vú hai bên." }
];

const RAW_THU_THUAT = [
  { name: "Bó thuốc", price: 57600, prep: "Làm sạch vùng da cần bó thuốc. Báo cho nhân viên y tế nếu có tiền sử dị ứng da.", desc: "Phương pháp đắp, bó các bài thuốc y học cổ truyền lên vùng khớp hoặc cơ bắp bị sưng đau, giúp giảm viêm, tiêu sưng và giảm đau nhức xương khớp." },
  { name: "Cắt chỉ", price: 40300, prep: "Vệ sinh vùng da xung quanh vết khâu, thông báo ngày khâu vết thương.", desc: "Kỹ thuật sát khuẩn vô khuẩn và rút chỉ khâu vết thương sau khi mép vết thương đã liền tốt (thường từ 5 - 14 ngày tùy vị trí)." },
  { name: "Cắt lọc tổ chức hoại tử hoặc cắt lọc vết thương đơn giản", price: 194700, prep: "Tiêm tê tại chỗ vết thương theo chỉ định của bác sĩ.", desc: "Thủ thuật ngoại khoa cắt bỏ các mô da hoại tử, dập nát, làm sạch dị vật và rửa sạch ổ thương tổn để vết thương mau lành tổ chức hạt." },
  { name: "Cấy chỉ", price: 156400, prep: "Tắm rửa sạch sẽ trước khi làm thủ thuật, không để bụng quá đói hoặc quá no.", desc: "Phương pháp đưa một đoạn chỉ tự tiêu (Catgut) vào huyệt đạo y học cổ truyền nhằm tạo kích thích liên tục, điều trị các bệnh mạn tính như thoái hóa cột sống, hen phế quản, mất ngủ." },
  { name: "Chăm sóc lỗ mở khí quản", price: 64300, prep: "Người bệnh nằm tư thế đầu cao 30 - 45 độ, thả lỏng cổ.", desc: "Quy trình hút sạch đờm dãi, vệ sinh nòng trong và vùng da quanh lỗ mở khí quản bằng dung dịch vô khuẩn, thay gạc và dây cố định canun." },
  { name: "Chọc dò dịch màng phổi", price: 153700, prep: "Người bệnh ngồi ôm gối hoặc tựa lưng ghế, giữ yên tư thế theo hướng dẫn.", desc: "Thủ thuật dùng kim chọc vào khoang màng phổi để lấy mẫu dịch xét nghiệm sinh hóa, tế bào vi sinh tìm nguyên nhân tràn dịch màng phổi." },
  { name: "Chọc hút dịch - khí màng phổi bằng kim hay catheter", price: 162900, prep: "Gây tê tại chỗ vô khuẩn thành ngực.", desc: "Thủ thuật cấp cứu hút tháo bớt dịch hoặc khí tích tụ trong khoang màng phổi giúp người bệnh giảm khó thở và tái nở phổi." },
  { name: "Chọc hút dịch vành tai", price: 64300, prep: "Vệ sinh sạch vành tai, ngồi yên giữ đầu cố định.", desc: "Thủ thuật chọc hút dịch huyết thanh hoặc máu tụ ở vành tai do chấn thương va đập, sau đó băng ép chống tái lập dịch." },
  { name: "Chọc tháo dịch ổ bụng điều trị", price: 195900, prep: "Đi tiểu sạch trước khi làm thủ thuật, nằm ngửa trên giường bệnh.", desc: "Đưa kim hoặc catheter vào khoang màng bụng dưới điều kiện vô khuẩn để tháo bớt dịch cổ trướng giúp giảm căng tức bụng và khó thở." },
  { name: "Cố định lồng ngực do chấn thương gãy xương sườn", price: 58400, prep: "Bộc lộ vùng lồng ngực bị chấn thương, hít thở nhẹ nhàng.", desc: "Kỹ thuật băng dính co giãn hoặc đai nẹp cố định thành ngực giảm biên độ di động xương sườn gãy, giảm đau và phòng ngừa tổn thương phổi." },
  { name: "Cứu điều trị liệt dây thần kinh số VII ngoại biên thể hàn", price: 37000, prep: "Nằm thư giãn, tránh gió lùa vào mặt.", desc: "Phương pháp dùng điếu ngải cứu hơ nóng ấm lên các huyệt vùng mặt giúp ôn thông kinh lạc, khu phong tán hàn điều trị liệt mặt méo miệng do lạnh." },
  { name: "Đặt catheter tĩnh mạch ngoại biên", price: 25100, prep: "Bộc lộ vùng cẳng tay hoặc mu bàn tay.", desc: "Kỹ thuật luồn kim nhựa mềm vô khuẩn vào lòng tĩnh mạch ngoại vi để truyền dịch, tiêm thuốc tĩnh mạch liên tục nhiều ngày." },
  { name: "Đặt nội khí quản", price: 600500, prep: "Chuẩn bị đầy đủ bóng thở, máy hút đờm và thuốc hồi sức cấp cứu.", desc: "Thủ thuật hồi sức cấp cứu luồn ống thở qua miệng hoặc mũi vào khí quản để kiểm soát đường thở và thông khí nhân tạo cho bệnh nhân ngừng thở, hôn mê." },
  { name: "Đặt ống thông dạ dày", price: 101800, prep: "Nằm đầu cao, hít sâu thở đều và phối hợp nuốt nhẹ khi ống qua ngã ba hầu họng.", desc: "Luồn ống thông qua mũi hoặc miệng vào lòng dạ dày để nuôi dưỡng người bệnh không tự ăn được hoặc rửa dạ dày giải áp." },
  { name: "Đặt sonde bàng quang", price: 101800, prep: "Vệ sinh sạch bộ phận sinh dục ngoài, nằm tư thế sản khoa.", desc: "Luồn ống thông niệu đạo vào bàng quang theo quy trình vô khuẩn tuyệt đối để dẫn lưu nước tiểu cho bệnh nhân bí tiểu hoặc phẫu thuật." },
  { name: "Đặt và tháo dụng cụ tử cung", price: 252500, prep: "Thực hiện tốt nhất sau khi vừa sạch kinh 2 - 3 ngày và không có thai hoặc viêm nhiễm phụ khoa cấp tính.", desc: "Thủ thuật sản phụ khoa đưa vòng tránh thai vào buồng tử cung hoặc tháo rút vòng tránh thai hết hạn." },
  { name: "Điện châm [kim ngắn]", price: 78300, prep: "Nằm thư giãn, không cử động các chi khi đang gắn máy điện châm.", desc: "Kỹ thuật châm kim vào các huyệt đạo kết hợp dòng điện xung vi dòng kích thích kinh lạc điều trị đau cơ xương khớp, phục hồi liệt thần kinh." },
  { name: "Điều trị bằng các dòng điện xung", price: 44900, prep: "Bộc lộ vùng cơ khớp cần điều trị.", desc: "Sử dụng các dòng điện xung tần số thấp và trung tần tác động giảm đau, giảm co thắt cơ và kích thích thần kinh cơ." },
  { name: "Điều trị bằng máy kéo giãn cột sống", price: 50800, prep: "Tháo thắt lưng, mặc trang phục rộng rãi, nằm ngửa trên bàn kéo.", desc: "Sử dụng máy kéo giãn điện tử tạo lực kéo dọc trục cột sống cổ hoặc thắt lưng, mở rộng khe gian đốt, giải phóng chèn ép rễ thần kinh do thoát vị đĩa đệm." },
  { name: "Điều trị bằng tia hồng ngoại", price: 40900, prep: "Bộc lộ vùng da chiếu đèn, giữ khoảng cách an toàn tránh bỏng nhiệt.", desc: "Ứng dụng nhiệt bức xạ tia hồng ngoại làm ấm sâu, giãn mạch, tăng lưu thông máu, giảm đau và chống co cứng cơ." },
  { name: "Định nhóm máu tại giường", price: 42100, prep: "Lấy giọt máu đầu ngón tay hoặc máu tĩnh mạch trực tiếp tại giường bệnh.", desc: "Kỹ thuật định nhóm máu hệ ABO và Rh bằng huyết thanh mẫu tại giường bệnh trước khi truyền máu cấp cứu đảm bảo an toàn hòa hợp." },
  { name: "Đỡ đẻ thường ngôi chỏm", price: 786700, prep: "Sản phụ nằm bàn sinh theo tư thế sản khoa, phối hợp rặn thở theo hiệu lệnh của nữ hộ sinh / bác sĩ.", desc: "Quy trình chuyên môn sản khoa theo dõi chuyển dạ, đỡ đẻ ngả âm đạo cho thai nhi ngôi chỏm, cắt khâu tầng sinh môn và chăm sóc sơ sinh ban đầu." },
  { name: "Hào châm", price: 76300, prep: "Nằm thư giãn thoải mái trên giường châm cứu.", desc: "Kỹ thuật dùng kim châm cứu truyền thống châm vào các huyệt vị trên cơ thể nhằm điều hòa khí huyết, cân bằng âm dương và chữa bệnh." },
  { name: "Hút đờm hầu họng", price: 14100, prep: "Nằm nghiêng đầu sang một bên hoặc nằm đầu cao.", desc: "Sử dụng máy hút áp lực âm vô khuẩn hút sạch đờm dãi, chất tiết ứ đọng ở miệng hầu giúp thông thoáng đường thở cho người bệnh." },
  { name: "Khâu vết thương phần mềm dài dưới 10 cm [tổn thương nông]", price: 194700, prep: "Sát trùng rộng xung quanh vết thương và tiêm thuốc tê tại chỗ.", desc: "Thủ thuật ngoại khoa rửa sạch vết rách da dưới 10cm ở lớp thượng bì/trung bì và khâu đóng mép vết thương bằng chỉ y tế vô khuẩn." },
  { name: "Khâu vết thương phần mềm dài dưới 10 cm [tổn thương sâu]", price: 289500, prep: "Gây tê tại chỗ vô khuẩn và kiểm tra dị vật trong đáy vết thương.", desc: "Phẫu thuật xử trí vết rách sâu đến lớp mỡ, cân cơ dưới 10cm, khâu phục hồi từng lớp giải phẫu và cầm máu kỹ." },
  { name: "Khâu vết thương phần mềm dài trên 10 cm [tổn thương nông]", price: 269500, prep: "Gây tê vùng vết thương, rửa sạch mô dập nát.", desc: "Khâu tạo hình đóng kín vết rách da nông có chiều dài trên 10cm đảm bảo thẩm mỹ và nhanh liền sẹo." },
  { name: "Khâu vết thương phần mềm dài trên 10 cm [tổn thương sâu]", price: 289500, prep: "Gây tê vô khuẩn, chuẩn bị dụng cụ phẫu thuật xử trí vết thương phức tạp.", desc: "Xử trí vết thương sâu rách rộng trên 10cm, thám sát mạch máu thần kinh, khâu phục hồi các lớp cân cơ và khâu đóng da." },
  { name: "Khí dung thuốc giãn phế quản", price: 27500, prep: "Ngồi thẳng lưng, ngậm ống thở hoặc đeo mặt nạ khí dung áp sát mũi miệng, hít sâu thở chậm.", desc: "Sử dụng máy khí dung tán nhỏ dung dịch thuốc giãn phế quản thành các hạt sương mịn đi sâu vào phế quản giúp cắt cơn hen suyễn hoặc đợt cấp COPD." },
  { name: "Kỹ thuật tập đứng và đi cho người bệnh liệt nửa người", price: 59300, prep: "Người bệnh mang giày bám chắc chắn, có kỹ thuật viên hướng dẫn trợ giúp.", desc: "Bài tập phục hồi chức năng rèn luyện khả năng thăng bằng chịu lực hai chân, chuyển trọng tâm và tái lập dáng đi cho bệnh nhân sau tai biến mạch máu não." },
  { name: "Kỹ thuật tập đường ruột cho người bệnh tổn thương tủy sống", price: 219700, prep: "Người bệnh nằm tư thế thoải mái.", desc: "Hướng dẫn và thực hiện kỹ thuật kích thích xoa bóp bụng, phản xạ tống phân giúp bệnh nhân liệt tủy tự chủ đại tiện tránh ứ đọng phân." },
  { name: "Kỹ thuật tập sử dụng và điều khiển xe lăn", price: 33400, prep: "Kiểm tra phanh xe lăn và chốt an toàn trước khi tập.", desc: "Hướng dẫn người bệnh kỹ năng tự di chuyển từ giường sang xe lăn, đẩy xe lăn trên địa hình bằng phẳng và lên xuống dốc an toàn." },
  { name: "Kỹ thuật tập tay và bàn tay cho người bệnh liệt nửa người", price: 51800, prep: "Ngồi trên ghế có tựa, đặt tay lên mặt bàn phẳng.", desc: "Bài tập vận động trị liệu kích thích phục hồi cơ bắp cánh tay, cổ tay và các động tác cầm nắm tinh vi của ngón tay." },
  { name: "Kỹ thuật xoa bóp toàn thân", price: 64900, prep: "Nằm thư giãn trên giường bệnh, mặc quần áo rộng rãi.", desc: "Thủ thuật xoa bóp day ấn huyệt toàn diện các vùng đầu mặt, lưng, tay chân giúp tăng cường tuần hoàn máu, thư giãn thần kinh và giảm nhức mỏi." },
  { name: "Kỹ thuật xoa bóp vùng", price: 51300, prep: "Bộc lộ vùng cơ đau (cổ gáy, vai, thắt lưng).", desc: "Xoa bóp, xát, miết, day, nhào cơ tại vùng tổn thương giúp giảm co cứng cơ cục bộ và lưu thông khí huyết." },
  { name: "Laser châm", price: 52100, prep: "Nằm yên, không nhìn trực tiếp vào chùm tia laser phát ra.", desc: "Sử dụng chùm tia laser công suất thấp chiếu vào các huyệt đạo thay cho kim châm, không đau, không chảy máu, an toàn cho trẻ em và người sợ kim." },
  { name: "Lấy dị vật giác mạc [giác mạc nông, một mắt, gây tê]", price: 99400, prep: "Nhỏ thuốc tê mắt, giữ mắt mở to nhìn thẳng vào một điểm theo hướng dẫn của bác sĩ mắt.", desc: "Thủ thuật nhãn khoa dùng kim gạt vô khuẩn lấy mạt sắt, bụi đá hoặc dị vật găm ở bề mặt giác mạc dưới kính hiển vi khám mắt." },
  { name: "Lấy dị vật họng miệng", price: 43100, prep: "Há to miệng, thở đều bằng mũi, không nuốt nước bọt đột ngột.", desc: "Dùng kẹp gắp y tế chuyên dụng gắp xương cá, vỏ thuốc hoặc dị vật mắc kẹt ở amidan, đáy lưỡi hoặc thành sau họng." },
  { name: "Lấy dị vật kết mạc", price: 71500, prep: "Nhỏ tê bề mặt mắt, nhìn theo hướng dẫn.", desc: "Lật mi mắt và dùng tăm bông vô khuẩn hoặc kẹp gắp lấy bụi bẩn, dị vật bám trên kết mạc mi mắt." },
  { name: "Lấy dị vật mũi [không gây mê]", price: 213900, prep: "Giữ đầu yên, hít thở bằng miệng.", desc: "Dùng móc hoặc kẹp chuyên khoa tai mũi họng gắp hạt cườm, đồ chơi, dị vật kẹt trong hốc mũi trẻ em/người lớn." },
  { name: "Lấy dị vật tai [đơn giản]", price: 70300, prep: "Nghiêng đầu bên tai có dị vật lên trên.", desc: "Dùng kẹp khuỷu hoặc bơm rửa nước ấm lấy côn trùng, hạt dị vật mắc trong ống tai ngoài." },
  { name: "Nội soi thực quản - dạ dày - tá tràng có sinh thiết", price: 493800, prep: "Bắt buộc nhịn ăn 6 - 8 giờ trước khi nội soi.", desc: "Quan sát trực tiếp niêm mạc dạ dày tá tràng kết hợp bấm lấy mẫu mô nghi ngờ qua kìm sinh thiết để làm xét nghiệm mô bệnh học chẩn đoán ung thư hoặc vi khuẩn HP." },
  { name: "Nội soi thực quản - dạ dày, lấy dị vật", price: 1743100, prep: "Nhịn ăn uống hoàn toàn, chụp X-quang kiểm tra vị trí dị vật trước khi soi.", desc: "Thủ thuật nội soi cấp cứu dùng kẹp chuyên dụng luồn qua ống soi để gắp xương lớn, răng giả, đồng xu hoặc dị vật sắc nhọn trong thực quản dạ dày tránh thủng thực quản." },
  { name: "Ôn châm", price: 76300, prep: "Nằm thư giãn trên giường châm cứu.", desc: "Phương pháp kết hợp châm kim và gắn viên ngải nhung đốt cháy trên chuôi kim nhằm truyền nhiệt ấm sâu vào huyệt đạo điều trị đau nhức do hàn tà." },
  { name: "Rửa bàng quang lấy máu cục", price: 230500, prep: "Nằm tư thế sản khoa, thả lỏng bụng dưới.", desc: "Bơm rửa bàng quang liên tục bằng dung dịch nước muối sinh lý vô khuẩn qua ống thông ba nhánh để hút tan máu cục chống tắc nghẽn đường tiểu." },
  { name: "Rửa dạ dày cấp cứu", price: 152000, prep: "Nằm nghiêng trái đầu thấp, phối hợp nuốt khi đặt ống sục dạ dày.", desc: "Thủ thuật cấp cứu đưa ống Faucher lớn vào dạ dày bơm rửa liên tục lượng lớn nước ấm nhằm đào thải chất độc, thuốc uống tự tử hoặc thức ăn ngộ độc ra ngoài." },
  { name: "Tập các kiểu thở", price: 32900, prep: "Ngồi thẳng lưng hoặc nằm ngửa thư giãn.", desc: "Hướng dẫn các kỹ thuật thở cơ hoành (thở bụng), thở chúm môi giúp tăng dung tích sống của phổi và cải thiện tình trạng khó thở mạn tính." },
  { name: "Tập đi với bàn xương cá", price: 33400, prep: "Mang giày bám tốt, có kỹ thuật viên đi kèm trợ giúp.", desc: "Luyện tập bước đi theo các thanh chéo của bàn xương cá giúp định hình khoảng cách bước chân và điều chỉnh dáng đi thăng bằng." },
  { name: "Tập đi với gậy", price: 33400, prep: "Điều chỉnh chiều cao gậy ngang mức mấu chuyển lớn xương đùi.", desc: "Hướng dẫn kỹ thuật đi bộ với gậy 1 chân hoặc gậy 4 chân cho bệnh nhân yếu chi dưới." },
  { name: "Tập đi với khung tập đi", price: 33400, prep: "Cầm chắc tay vịn của khung tập đi.", desc: "Tập phục hồi chức năng dáng đi với khung tập đi hỗ trợ chịu lực vững chắc cho người sau phẫu thuật xương khớp hoặc người cao tuổi." },
  { name: "Tập đi với khung treo", price: 33400, prep: "Mặc áo nâng đỡ an toàn nối với hệ thống khung treo.", desc: "Tập đi với hệ thống khung treo giảm tải một phần trọng lượng cơ thể giúp người bệnh liệt yếu tự tin bước đi không sợ ngã." },
  { name: "Tập đi với nạng (nạng nách, nạng khuỷu)", price: 33400, prep: "Điều chỉnh nạng cách nách 3 - 4cm tránh tì đè đám rối thần kinh cánh tay.", desc: "Hướng dẫn dáng đi 2 điểm, 3 điểm hoặc 4 điểm với nạng nách/nạng khuỷu sau gãy xương chi dưới." },
  { name: "Tập điều hợp vận động", price: 59300, prep: "Tập trung chú ý theo các bài tập phối hợp động tác.", desc: "Bài tập rèn luyện tính chính xác và nhịp nhàng của các cử động tay chân ở bệnh nhân tổn thương tiểu não hoặc Parkinson." },
  { name: "Tập do cứng khớp", price: 56200, prep: "Chườm ấm khớp trước khi tập kéo dãn.", desc: "Kỹ thuật viên thực hiện các động tác kéo giãn, trượt diện khớp nhẹ nhàng để gia tăng tầm vận động của các khớp bị co rút xơ dính sau bó bột." },
  { name: "Tập đứng thăng bằng tĩnh và động", price: 59300, prep: "Đứng cạnh thanh song song hoặc có người trợ giúp.", desc: "Rèn luyện khả năng giữ thăng bằng cơ thể khi đứng yên và khi chuyển động với mắt mở/mắt nhắm." },
  { name: "Tập ho có trợ giúp", price: 32900, prep: "Ngồi hơi nghiêng người ra trước.", desc: "Kỹ thuật viên hỗ trợ ấn nhẹ lồng ngực phối hợp nhịp thở giúp người bệnh liệt cơ hoành tống đờm dãi ra ngoài." },
  { name: "Tập lên, xuống cầu thang", price: 33400, prep: "Vịn chắc vào tay vịn cầu thang.", desc: "Huấn luyện nguyên tắc bước chân lành lên trước khi lên cầu thang và bước chân đau xuống trước khi xuống cầu thang." },
  { name: "Tập luyện với ghế tập cơ 4 đầu đùi", price: 14700, prep: "Ngồi vững trên ghế tập, cố định đai chân.", desc: "Tập duỗi gối có tạ kháng lực trên ghế tập chuyên dụng nhằm tăng cường sức mạnh cơ tứ đầu đùi bảo vệ khớp gối." },
  { name: "Tập mạnh cơ đáy chậu (cơ sàn chậu, pelvis floor)", price: 318700, prep: "Đi tiểu sạch trước khi bắt đầu bài tập.", desc: "Bài tập co thắt cơ sàn chậu (bài tập Kegel chuyên sâu) điều trị chứng tiểu không tự chủ, són tiểu hoặc sa tạng chậu ở phụ nữ." },
  { name: "Tập ngồi thăng bằng tĩnh và động", price: 59300, prep: "Ngồi trên mép giường hoặc bóng tập.", desc: "Luyện khả năng giữ thăng bằng thân mình khi ngồi cho bệnh nhân liệt chi hoặc tổn thương thần kinh trung ương." },
  { name: "Tập tạo thuận thần kinh cơ cảm thụ bản thể chức năng", price: 59300, prep: "Phối hợp làm theo hiệu lệnh và lực kháng trở của kỹ thuật viên.", desc: "Kỹ thuật PNF (Proprioceptive Neuromuscular Facilitation) kích thích đường dẫn truyền thần kinh cơ giúp tăng cường sức mạnh và độ linh hoạt vận động." },
  { name: "Tập vận động có kháng trở", price: 59300, prep: "Thực hiện động tác chống lại lực cản tay hoặc tạ nhẹ.", desc: "Rèn luyện làm tăng khối lượng và sức mạnh cơ bắp cho các nhóm cơ bị teo nhược." },
  { name: "Tập vận động có trợ giúp", price: 59300, prep: "Người bệnh cố gắng tự vận động tối đa phần sức lực có thể.", desc: "Kỹ thuật viên trợ giúp một phần lực để hoàn thành trọn vẹn tầm vận động của khớp." },
  { name: "Tập vận động đoạn chi 30 phút", price: 51800, prep: "Nằm hoặc ngồi thư giãn trong suốt buổi tập.", desc: "Thực hiện chuỗi bài tập vận động chuyên sâu cho một vùng tay hoặc chân trong 30 phút." },
  { name: "Tập vận động thụ động", price: 59300, prep: "Người bệnh thả lỏng hoàn toàn cơ bắp.", desc: "Kỹ thuật viên hoàn toàn dùng lực tay cử động các khớp của bệnh nhân hôn mê hoặc liệt hoàn toàn giúp chống cứng khớp và teo cơ." },
  { name: "Tập vận động toàn thân 30 phút", price: 59300, prep: "Trang phục vận động thoải mái.", desc: "Chương trình tập phục hồi chức năng toàn diện kéo dài 30 phút cho tất cả các nhóm cơ chính trên cơ thể." },
  { name: "Tập với dụng cụ quay khớp vai", price: 33400, prep: "Đứng đối diện dụng cụ quay tay lái, giữ lưng thẳng.", desc: "Tập xoay khớp vai theo vòng quay của vô lăng tập giúp phục hồi độ mở của khớp vai trong bệnh đông cứng khớp vai." },
  { name: "Tập với ghế tập mạnh cơ tứ đầu đùi", price: 14700, prep: "Ngồi đúng tư thế trên ghế tập.", desc: "Luyện tập sức cơ đùi chống lực cản giúp củng cố độ vững của khớp gối." },
  { name: "Tập với giàn treo các chi", price: 33400, prep: "Chi thể được nâng đỡ trong các đai treo êm ái.", desc: "Tập vận động tay chân trong môi trường loại bỏ trọng lực giúp bệnh nhân yếu cơ dễ dàng thực hiện cử động." },
  { name: "Tập với hệ thống ròng rọc", price: 14700, prep: "Cầm chắc hai đầu dây ròng rọc.", desc: "Dùng tay lành kéo dây qua ròng rọc để trợ giúp kéo tay đau lên cao, phục hồi tầm vận động khớp vai." },
  { name: "Tập với ròng rọc", price: 14700, prep: "Ngồi hoặc đứng dưới hệ thống ròng rọc.", desc: "Bài tập ròng rọc kéo dãn và gia tăng tầm vận động khớp chi trên." },
  { name: "Tập với thang tường", price: 33400, prep: "Đứng thẳng đối diện hoặc quay lưng vào thang tường.", desc: "Tập đu xà, với tay leo từng bậc thang tường giúp kéo giãn cột sống và mở rộng biên độ khớp vai." },
  { name: "Tập với xe đạp tập", price: 14700, prep: "Điều chỉnh yên xe phù hợp chiều dài chân.", desc: "Đạp xe đạp tập lực cản nhẹ giúp tăng cường tuần hoàn tim mạch và độ dẻo dai của các khớp chi dưới." },
  { name: "Thay băng, cắt chỉ [chiều dài ≤ 15cm]", price: 64300, prep: "Bộc lộ vết thương cần thay băng hoặc cắt chỉ.", desc: "Quy trình rửa sạch vết mổ dưới 15cm bằng dung dịch sát khuẩn vô trùng, cắt rút chỉ và băng lại bằng gạc vô khuẩn." },
  { name: "Thay băng, cắt chỉ [chiều dài trên 15cm đến 30 cm]", price: 89500, prep: "Nằm yên trên giường tiểu phẫu.", desc: "Chăm sóc vết mổ dài từ 15 - 30cm, kiểm tra mép vết mổ, rút chỉ và thay băng vô khuẩn." },
  { name: "Thay băng, cắt chỉ [chiều dài từ trên 30 cm đến 50 cm]", price: 121400, prep: "Bộc lộ toàn bộ chiều dài vết mổ lớn.", desc: "Quy trình chăm sóc và cắt chỉ cho vết mổ lớn phức tạp từ 30 - 50cm đảm bảo tuyệt đối vô khuẩn." },
  { name: "Thông tiểu", price: 101800, prep: "Vệ sinh vùng sinh dục ngoài, nằm tư thế thoải mái.", desc: "Thủ thuật đưa ống thông mềm qua niệu đạo vào bàng quang để tháo nước tiểu làm giảm áp lực bàng quang căng tức." },
  { name: "Thủy châm", price: 77100, prep: "Nằm thư giãn trên giường bệnh.", desc: "Phương pháp dùng kim tiêm đưa một lượng nhỏ dung dịch thuốc bổ thần kinh hoặc giảm đau vào huyệt đạo y học cổ truyền." },
  { name: "Tiêm bắp thịt", price: 15100, prep: "Bộc lộ vùng mông hoặc cơ delta cánh tay.", desc: "Kỹ thuật tiêm thuốc vào sâu trong bắp cơ theo quy trình tiêm an toàn của Bộ Y tế." },
  { name: "Tiêm dưới da", price: 15100, prep: "Bộc lộ vùng tiêm (bụng, cánh tay).", desc: "Kỹ thuật tiêm thuốc vào lớp mô mỡ liên kết dưới da (thường dùng tiêm Insulin, thuốc chống đông)." },
  { name: "Tiêm tĩnh mạch", price: 15100, prep: "Đặt tay lên gối tiêm, nắm chặt bàn tay khi garo.", desc: "Kỹ thuật đưa thuốc trực tiếp vào lòng tĩnh mạch để thuốc tác dụng nhanh chóng trong điều trị." },
  { name: "Tiêm trong da", price: 15100, prep: "Bộc lộ 1/3 trên mặt trước trong cẳng tay.", desc: "Kỹ thuật tiêm lượng nhỏ thuốc vào lớp thượng bì tạo nốt phồng da để thử phản ứng dị ứng thuốc (test lẩy da) hoặc tiêm phòng." },
  { name: "Truyền tĩnh mạch", price: 25100, prep: "Nằm ngửa thoải mái trên giường bệnh, giữ cố định tay truyền.", desc: "Kỹ thuật đưa lượng lớn dịch truyền hoặc dung dịch thuốc nhỏ giọt liên tục vào tĩnh mạch qua dây truyền dịch vô khuẩn." },
  { name: "Vận động trị liệu hô hấp", price: 32900, prep: "Ngồi thẳng hoặc nằm đầu cao.", desc: "Tập vỗ rung lồng ngực, dẫn lưu tư thế và tập thở giúp tống xuất dịch tiết phế quản ở bệnh nhân viêm phổi, giãn phế quản." },
  { name: "Xoa bóp bấm huyệt bằng tay", price: 76000, prep: "Nằm thả lỏng cơ thể trên giường điều trị y học cổ truyền.", desc: "Thủ thuật dùng bàn tay và ngón tay tác động lên da thịt và các huyệt đạo giúp giảm đau, điều hòa thần kinh và giải tỏa căng thẳng." }
];

console.log(`Summary:
- Xét nghiệm: ${RAW_XET_NGHIEM.length}
- Khám bệnh: ${RAW_KHAM_BENH.length}
- Chẩn đoán hình ảnh: ${RAW_CHAN_DOAN_HINH_ANH.length}
- Thủ thuật: ${RAW_THU_THUAT.length}
- Total: ${RAW_XET_NGHIEM.length + RAW_KHAM_BENH.length + RAW_CHAN_DOAN_HINH_ANH.length + RAW_THU_THUAT.length}`);

// Generate MedicalService items
let idCounter = 1;
const allServices = [];

function addItems(list, category, categoryName, defaultRoom, defaultTime, bhytPercent, idPrefix) {
  let subIndex = 1;
  for (const item of list) {
    const id = `${idPrefix}-${String(subIndex).padStart(3, '0')}`;
    const code = `${idPrefix}.${String(subIndex).padStart(2, '0')}`;
    
    // Choose specific room if applicable
    let room = defaultRoom;
    if (item.name.toLowerCase().includes('siêu âm')) {
      room = 'Phòng Siêu Âm - Tầng 1 (Khu A)';
    } else if (item.name.toLowerCase().includes('x-quang') || item.name.toLowerCase().includes('chụp')) {
      room = 'Phòng X-quang Kỹ thuật số - Tầng 1';
    } else if (item.name.toLowerCase().includes('nội soi')) {
      room = 'Phòng Nội Soi Tiêu Hóa - Tai Mũi Họng';
    } else if (item.name.toLowerCase().includes('điện tim')) {
      room = 'Phòng Thăm dò chức năng - Điện tim';
    } else if (item.name.toLowerCase().includes('châm') || item.name.toLowerCase().includes('bó thuốc') || item.name.toLowerCase().includes('bấm huyệt')) {
      room = 'Khoa Y Học Cổ Truyền - Tầng 2';
    } else if (item.name.toLowerCase().includes('tập') || item.name.toLowerCase().includes('vật lý') || item.name.toLowerCase().includes('hồng ngoại') || item.name.toLowerCase().includes('kéo giãn')) {
      room = 'Khoa Phục Hồi Chức Năng - Tầng 2';
    } else if (item.name.toLowerCase().includes('khâu') || item.name.toLowerCase().includes('cắt chỉ') || item.name.toLowerCase().includes('thay băng') || item.name.toLowerCase().includes('dị vật')) {
      room = 'Phòng Tiểu Phẫu & Xử Trí Vết Thương - Tầng 1';
    } else if (item.name.toLowerCase().includes('tiêm') || item.name.toLowerCase().includes('truyền') || item.name.toLowerCase().includes('khí dung')) {
      room = 'Phòng Tiêm Truyền & Thủ Thuật - Tầng 1';
    }

    allServices.push({
      id,
      code,
      name: item.name,
      category,
      categoryName,
      priceBHYT: item.price,
      priceService: item.price,
      bhytCoveragePercent: item.name.includes('test nhanh') && (item.name.includes('ma túy') || item.name.includes('Heroin') || item.name.includes('Amphetamine') || item.name.includes('Codein') || item.name.includes('Marijuana') || item.name.includes('Morphin') || item.name.includes('Opiate')) || item.name.includes('Khám sức khỏe đi làm') ? 0 : bhytPercent,
      room,
      estimatedTime: defaultTime,
      prepInstructions: item.prep,
      description: item.desc,
      isPopular: subIndex <= 5
    });
    subIndex++;
    idCounter++;
  }
}

addItems(RAW_XET_NGHIEM, 'xat-nghiem', 'Xét nghiệm', 'Phòng Xét Nghiệm - Tầng 1 (Khu A)', '30 - 45 phút', 80, 'XN');
addItems(RAW_KHAM_BENH, 'kham-benh', 'Khám bệnh', 'Khu Khám Bệnh - Tầng 1', '15 - 30 phút', 100, 'KB');
addItems(RAW_CHAN_DOAN_HINH_ANH, 'chan-doan-hinh-anh', 'Chẩn đoán hình ảnh', 'Phòng Chẩn Đoán Hình Ảnh - Tầng 1', '15 - 30 phút', 80, 'CDHA');
addItems(RAW_THU_THUAT, 'phau-thuat-thu-thuat', 'Phẫu thuật - Thủ thuật', 'Khu Thủ Thuật & PHCN - Tầng 1 & 2', '20 - 40 phút', 80, 'TT');

// Write to src/data/medicalServices.ts
const tsContent = `import { MedicalService } from '../types';

export const INITIAL_SERVICES: MedicalService[] = ${JSON.stringify(allServices, null, 2)};

export const CATEGORIES_CONFIG = [
  { id: 'all', name: 'Tất cả dịch vụ', icon: 'LayoutGrid', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'xat-nghiem', name: 'Xét nghiệm', icon: 'FlaskConical', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'chan-doan-hinh-anh', name: 'Chẩn đoán hình ảnh', icon: 'Scan', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { id: 'phau-thuat-thu-thuat', name: 'Thủ thuật - PHCN', icon: 'Stethoscope', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'kham-benh', name: 'Khám bệnh', icon: 'HeartPulse', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
];

export const CENTER_INFO = {
  name: 'TRUNG TÂM Y TẾ KHU VỰC MỘC HÓA',
  subTitle: 'Tra cứu dịch vụ cận lâm sàng',
  address: 'Ấp Bình Phong Thạnh 2, xã Mộc Hóa, tỉnh Tây Ninh.',
  hotline: '02723.956.818',
  emergency: '02723.956.838',
  workingHours: 'Thứ 2 - Thứ 6: 07:00 - 16:30 | Cấp cứu: 24/7',
  website: 'https://mochoa.ytelongan.gov.vn',
};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/medicalServices.ts'), tsContent, 'utf-8');

// Ensure data directory exists and update DB_FILE
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
fs.writeFileSync(path.join(dataDir, 'services-db.json'), JSON.stringify(allServices, null, 2), 'utf-8');

console.log('Successfully generated medicalServices.ts and data/services-db.json with total items:', allServices.length);
